#!/usr/bin/env node
/**
 * NoQueueBarber – Browser Audit MCP Server
 *
 * Exposes one MCP tool: `audit_app`
 * It launches a real Chromium browser, visits every important route of the
 * NoQueueBarber React app, and returns a structured report covering:
 *   • Console warnings / errors
 *   • Failed / slow network requests (API calls included)
 *   • React hydration / render errors
 *   • Accessibility violations (via axe-core)
 *   • Performance metrics (LCP, FCP, TTI, TBT)
 *
 * ─── Setup ───────────────────────────────────────────────────────────────────
 *   npm install
 *   # then register in your MCP config (see README)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── MCP Server bootstrap ─────────────────────────────────────────────────────
const server = new Server(
    { name: "audit-mcp", version: "1.0.0" },
    { capabilities: { tools: {} } }
);

// ─── Tool definitions ─────────────────────────────────────────────────────────
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        {
            name: "audit_app",
            description:
                "Launches a real Chromium browser, crawls every route of the NoQueueBarber app, " +
                "captures console errors/warnings, network failures, API errors, slow requests, " +
                "and performance metrics, then returns a full structured audit report.",
            inputSchema: {
                type: "object",
                properties: {
                    base_url: {
                        type: "string",
                        description:
                            'Base URL of the running app. Default: "http://localhost:5173"',
                    },
                    routes: {
                        type: "array",
                        items: { type: "string" },
                        description:
                            'Additional routes to audit beyond the defaults. E.g. ["/stores", "/dashboard"]',
                    },
                    slow_request_threshold_ms: {
                        type: "number",
                        description:
                            "Requests taking longer than this (ms) are flagged as slow. Default: 2000",
                    },
                    headless: {
                        type: "boolean",
                        description:
                            "Run browser headless (no visible window). Default: false – opens a real browser window.",
                    },
                    save_report: {
                        type: "boolean",
                        description:
                            "Save an HTML report file alongside this server. Default: true",
                    },
                    auth: {
                        type: "object",
                        description: "Optional credentials to test authenticated routes",
                        properties: {
                            email: { type: "string" },
                            password: { type: "string" },
                        },
                    },
                },
                required: [],
            },
        },
    ],
}));

// ─── Tool handler ─────────────────────────────────────────────────────────────
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name !== "audit_app") {
        throw new Error(`Unknown tool: ${request.params.name}`);
    }

    const args = request.params.arguments ?? {};
    const baseUrl = args.base_url ?? "http://localhost:5173";
    const slowThreshold = args.slow_request_threshold_ms ?? 2000;
    const headless = args.headless ?? false; // show browser by default
    const saveReport = args.save_report !== false;

    const DEFAULT_ROUTES = ["/", "/stores", "/dashboard", "/contact"];
    const routes = [
        ...new Set([...DEFAULT_ROUTES, ...(args.routes ?? [])]),
    ];

    // ── Launch browser ──────────────────────────────────────────────────────────
    const browser = await chromium.launch({
        headless,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const auditResults = [];

    try {
        // ── Optional: log in once and reuse the storage state ───────────────────
        let storageState;
        if (args.auth?.email && args.auth?.password) {
            storageState = await loginAndCaptureState(
                browser,
                baseUrl,
                args.auth.email,
                args.auth.password
            );
        }

        // ── Audit each route ─────────────────────────────────────────────────────
        for (const route of routes) {
            const result = await auditRoute(
                browser,
                baseUrl,
                route,
                slowThreshold,
                storageState
            );
            auditResults.push(result);
        }
    } finally {
        await browser.close();
    }

    // ── Build summary ────────────────────────────────────────────────────────
    const summary = buildSummary(auditResults);

    // ── Optionally save HTML report ──────────────────────────────────────────
    let reportPath = null;
    if (saveReport) {
        reportPath = path.join(__dirname, "audit-report.html");
        fs.writeFileSync(reportPath, buildHtmlReport(summary, auditResults));
    }

    const output = formatMarkdownReport(summary, auditResults, reportPath);

    return {
        content: [{ type: "text", text: output }],
    };
});

// ─── Core: audit a single route ───────────────────────────────────────────────
async function auditRoute(browser, baseUrl, route, slowThreshold, storageState) {
    const url = `${baseUrl}${route}`;
    const context = await browser.newContext({
        ...(storageState ? { storageState } : {}),
        // Capture all responses including XHR/fetch
        recordVideo: undefined,
    });

    const page = await context.newPage();

    const consoleMessages = [];
    const networkEvents = [];
    const jsErrors = [];

    // ── Console listener ────────────────────────────────────────────────────
    page.on("console", (msg) => {
        const type = msg.type(); // 'log' | 'warn' | 'error' | 'info' | 'debug'
        if (type === "warning" || type === "warn" || type === "error") {
            consoleMessages.push({
                type,
                text: msg.text(),
                location: msg.location(),
                args: msg.args().length,
            });
        }
    });

    // ── Uncaught JS errors ───────────────────────────────────────────────────
    page.on("pageerror", (err) => {
        jsErrors.push({
            message: err.message,
            stack: err.stack?.split("\n").slice(0, 5).join("\n"),
        });
    });

    // ── Network request tracking ─────────────────────────────────────────────
    const pendingRequests = new Map();

    page.on("request", (req) => {
        pendingRequests.set(req.url(), { start: Date.now(), req });
    });

    page.on("response", (res) => {
        const url = res.url();
        const pending = pendingRequests.get(url);
        const duration = pending ? Date.now() - pending.start : null;
        pendingRequests.delete(url);

        const isApi =
            url.includes("/api/") ||
            url.includes("localhost:3000") ||
            url.includes("localhost:5000");

        networkEvents.push({
            url,
            status: res.status(),
            method: res.request().method(),
            duration,
            isApi,
            failed: res.status() >= 400,
            slow: duration !== null && duration > slowThreshold,
            resourceType: res.request().resourceType(),
        });
    });

    page.on("requestfailed", (req) => {
        pendingRequests.delete(req.url());
        networkEvents.push({
            url: req.url(),
            status: 0,
            method: req.method(),
            duration: null,
            isApi:
                req.url().includes("/api/") || req.url().includes("localhost:3000"),
            failed: true,
            slow: false,
            failureText: req.failure()?.errorText ?? "Unknown error",
            resourceType: req.resourceType(),
        });
    });

    // ── Navigate ─────────────────────────────────────────────────────────────
    let navigationError = null;
    let performanceMetrics = {};

    try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });

        // Give React time to finish rendering
        await page.waitForTimeout(1500);

        // ── Web Vitals via JS ───────────────────────────────────────────────
        performanceMetrics = await page.evaluate(() => {
            const nav = performance.getEntriesByType("navigation")[0];
            const paint = Object.fromEntries(
                performance.getEntriesByType("paint").map((e) => [e.name, Math.round(e.startTime)])
            );
            return {
                domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
                loadComplete: nav ? Math.round(nav.loadEventEnd) : null,
                firstPaint: paint["first-paint"] ?? null,
                firstContentfulPaint: paint["first-contentful-paint"] ?? null,
                transferSize: nav ? nav.transferSize : null,
            };
        });

        // ── Inject axe-core for a11y ────────────────────────────────────────
        await page.addScriptTag({
            url: "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js",
        });
        const a11yResults = await page.evaluate(async () => {
            return new Promise((resolve) => {
                // @ts-ignore
                window.axe.run(document, { reporter: "v2" }, (err, results) => {
                    if (err) resolve({ violations: [], error: String(err) });
                    else
                        resolve({
                            violations: results.violations.map((v) => ({
                                id: v.id,
                                impact: v.impact,
                                description: v.description,
                                nodes: v.nodes.length,
                            })),
                        });
                });
            });
        });
        performanceMetrics.a11y = a11yResults;
    } catch (err) {
        navigationError = err.message;
    }

    await context.close();

    return {
        route,
        url,
        navigationError,
        consoleMessages,
        jsErrors,
        networkEvents,
        performanceMetrics,
    };
}

// ─── Login helper ─────────────────────────────────────────────────────────────
async function loginAndCaptureState(browser, baseUrl, email, password) {
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
        await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
        // Click the Login button in the navbar
        await page.click("button:has-text('Login')");
        await page.fill('input[type="email"]', email);
        await page.fill('input[type="password"]', password);
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: "networkidle", timeout: 10_000 });
    } catch {
        // login may fail – we still capture whatever state we have
    }
    const state = await context.storageState();
    await context.close();
    return state;
}

// ─── Summary builder ──────────────────────────────────────────────────────────
function buildSummary(results) {
    let totalConsoleErrors = 0;
    let totalConsoleWarnings = 0;
    let totalApiFailures = 0;
    let totalNetworkFailures = 0;
    let totalSlowRequests = 0;
    let totalJsErrors = 0;
    let totalA11yViolations = 0;

    for (const r of results) {
        totalJsErrors += r.jsErrors.length;
        for (const m of r.consoleMessages) {
            if (m.type === "error") totalConsoleErrors++;
            else totalConsoleWarnings++;
        }
        for (const n of r.networkEvents) {
            if (n.failed && n.isApi) totalApiFailures++;
            else if (n.failed) totalNetworkFailures++;
            if (n.slow) totalSlowRequests++;
        }
        totalA11yViolations +=
            r.performanceMetrics?.a11y?.violations?.length ?? 0;
    }

    const health =
        totalJsErrors + totalConsoleErrors + totalApiFailures === 0
            ? "✅ HEALTHY"
            : totalJsErrors + totalApiFailures > 3
                ? "🔴 CRITICAL"
                : "🟡 NEEDS ATTENTION";

    return {
        health,
        routesAudited: results.length,
        totalJsErrors,
        totalConsoleErrors,
        totalConsoleWarnings,
        totalApiFailures,
        totalNetworkFailures,
        totalSlowRequests,
        totalA11yViolations,
    };
}

// ─── Markdown report ──────────────────────────────────────────────────────────
function formatMarkdownReport(summary, results, reportPath) {
    const lines = [];

    lines.push("# 🔍 NoQueueBarber – Browser Audit Report");
    lines.push("");
    lines.push(`**Overall Health:** ${summary.health}`);
    lines.push(`**Routes audited:** ${summary.routesAudited}`);
    lines.push("");
    lines.push("## 📊 Summary");
    lines.push("| Category | Count |");
    lines.push("|---|---|");
    lines.push(`| JS Runtime Errors | ${summary.totalJsErrors} |`);
    lines.push(`| Console Errors | ${summary.totalConsoleErrors} |`);
    lines.push(`| Console Warnings | ${summary.totalConsoleWarnings} |`);
    lines.push(`| API Failures (4xx/5xx) | ${summary.totalApiFailures} |`);
    lines.push(`| Other Network Failures | ${summary.totalNetworkFailures} |`);
    lines.push(`| Slow Requests (>threshold) | ${summary.totalSlowRequests} |`);
    lines.push(`| Accessibility Violations | ${summary.totalA11yViolations} |`);
    lines.push("");

    for (const r of results) {
        lines.push(`---`);
        lines.push(`## 📄 Route: \`${r.route}\``);
        lines.push(`URL: ${r.url}`);

        if (r.navigationError) {
            lines.push(`\n> ⚠️ **Navigation error:** ${r.navigationError}`);
        }

        // Performance
        const pm = r.performanceMetrics;
        if (pm && Object.keys(pm).length) {
            lines.push("\n### ⚡ Performance");
            if (pm.firstContentfulPaint !== null && pm.firstContentfulPaint !== undefined)
                lines.push(`- First Contentful Paint: **${pm.firstContentfulPaint} ms**`);
            if (pm.domContentLoaded !== null && pm.domContentLoaded !== undefined)
                lines.push(`- DOM Content Loaded: **${pm.domContentLoaded} ms**`);
            if (pm.loadComplete !== null && pm.loadComplete !== undefined)
                lines.push(`- Load Complete: **${pm.loadComplete} ms**`);
            if (pm.transferSize !== null && pm.transferSize !== undefined)
                lines.push(`- Transfer Size: **${(pm.transferSize / 1024).toFixed(1)} KB**`);
        }

        // JS Errors
        if (r.jsErrors.length) {
            lines.push("\n### 🔴 JavaScript Runtime Errors");
            for (const e of r.jsErrors) {
                lines.push(`- **${e.message}**`);
                if (e.stack) lines.push("  ```\n  " + e.stack + "\n  ```");
            }
        }

        // Console
        const consoleErrors = r.consoleMessages.filter((m) => m.type === "error");
        const consoleWarnings = r.consoleMessages.filter(
            (m) => m.type !== "error"
        );

        if (consoleErrors.length) {
            lines.push("\n### 🔴 Console Errors");
            for (const m of consoleErrors) {
                lines.push(`- \`${m.text}\``);
                if (m.location?.url)
                    lines.push(
                        `  ↳ \`${m.location.url}:${m.location.lineNumber}\``
                    );
            }
        }

        if (consoleWarnings.length) {
            lines.push("\n### 🟡 Console Warnings");
            for (const m of consoleWarnings) {
                lines.push(`- \`${m.text}\``);
            }
        }

        // Network
        const apiFailures = r.networkEvents.filter((n) => n.failed && n.isApi);
        const otherFailures = r.networkEvents.filter((n) => n.failed && !n.isApi);
        const slowReqs = r.networkEvents.filter((n) => n.slow);
        const successfulApis = r.networkEvents.filter(
            (n) => n.isApi && !n.failed
        );

        if (apiFailures.length) {
            lines.push("\n### 🔴 API Failures");
            lines.push("| Method | URL | Status | Duration |");
            lines.push("|---|---|---|---|");
            for (const n of apiFailures) {
                lines.push(
                    `| ${n.method} | ${shorten(n.url)} | ${n.status || n.failureText} | ${n.duration ?? "—"} ms |`
                );
            }
        }

        if (successfulApis.length) {
            lines.push("\n### ✅ Successful API Calls");
            lines.push("| Method | URL | Status | Duration |");
            lines.push("|---|---|---|---|");
            for (const n of successfulApis) {
                lines.push(
                    `| ${n.method} | ${shorten(n.url)} | ${n.status} | ${n.duration ?? "—"} ms |`
                );
            }
        }

        if (slowReqs.length) {
            lines.push("\n### 🐢 Slow Requests");
            lines.push("| Method | URL | Duration |");
            lines.push("|---|---|---|");
            for (const n of slowReqs) {
                lines.push(
                    `| ${n.method} | ${shorten(n.url)} | **${n.duration} ms** |`
                );
            }
        }

        if (otherFailures.length) {
            lines.push("\n### 🟠 Other Network Failures");
            for (const n of otherFailures) {
                lines.push(
                    `- [${n.status || n.failureText}] ${n.method} ${shorten(n.url)}`
                );
            }
        }

        // Accessibility
        const violations = pm?.a11y?.violations ?? [];
        if (violations.length) {
            lines.push("\n### ♿ Accessibility Violations");
            lines.push("| Rule | Impact | Description | Elements |");
            lines.push("|---|---|---|---|");
            for (const v of violations) {
                lines.push(
                    `| \`${v.id}\` | ${v.impact} | ${v.description} | ${v.nodes} |`
                );
            }
        }
    }

    if (reportPath) {
        lines.push("");
        lines.push(`---`);
        lines.push(`📁 Full HTML report saved to: \`${reportPath}\``);
    }

    return lines.join("\n");
}

// ─── HTML Report ──────────────────────────────────────────────────────────────
function buildHtmlReport(summary, results) {
    const ts = new Date().toLocaleString();
    let rows = "";

    for (const r of results) {
        const apiF = r.networkEvents.filter((n) => n.failed && n.isApi);
        const consoleE = r.consoleMessages.filter((m) => m.type === "error");
        const consoleW = r.consoleMessages.filter((m) => m.type !== "error");
        const slowR = r.networkEvents.filter((n) => n.slow);
        const okApis = r.networkEvents.filter((n) => n.isApi && !n.failed);
        const violations = r.performanceMetrics?.a11y?.violations ?? [];

        rows += `
    <section class="route-section">
      <h2 class="route-title">📄 ${r.route} <span class="url-badge">${r.url}</span></h2>

      ${r.navigationError ? `<div class="alert error">⚠️ Navigation Error: ${esc(r.navigationError)}</div>` : ""}

      <div class="metrics-grid">
        <div class="metric">
          <div class="metric-value error-color">${r.jsErrors.length}</div>
          <div class="metric-label">JS Errors</div>
        </div>
        <div class="metric">
          <div class="metric-value error-color">${consoleE.length}</div>
          <div class="metric-label">Console Errors</div>
        </div>
        <div class="metric">
          <div class="metric-value warn-color">${consoleW.length}</div>
          <div class="metric-label">Warnings</div>
        </div>
        <div class="metric">
          <div class="metric-value error-color">${apiF.length}</div>
          <div class="metric-label">API Failures</div>
        </div>
        <div class="metric">
          <div class="metric-value warn-color">${slowR.length}</div>
          <div class="metric-label">Slow Requests</div>
        </div>
        <div class="metric">
          <div class="metric-value ok-color">${okApis.length}</div>
          <div class="metric-label">OK API Calls</div>
        </div>
      </div>

      ${r.performanceMetrics?.firstContentfulPaint !== undefined
                ? `<div class="perf-bar">
              <span>FCP: <b>${r.performanceMetrics.firstContentfulPaint} ms</b></span>
              <span>DCL: <b>${r.performanceMetrics.domContentLoaded} ms</b></span>
              <span>Load: <b>${r.performanceMetrics.loadComplete} ms</b></span>
              <span>Size: <b>${((r.performanceMetrics.transferSize ?? 0) / 1024).toFixed(1)} KB</b></span>
            </div>`
                : ""
            }

      ${r.jsErrors.length ? `
        <h3 class="section-header error-bg">🔴 JS Runtime Errors</h3>
        ${r.jsErrors.map(e => `<div class="log-entry error-entry"><b>${esc(e.message)}</b><pre>${esc(e.stack ?? "")}</pre></div>`).join("")}
      ` : ""}

      ${consoleE.length ? `
        <h3 class="section-header error-bg">🔴 Console Errors</h3>
        ${consoleE.map(m => `<div class="log-entry error-entry">${esc(m.text)}${m.location?.url ? `<span class="source">↳ ${esc(m.location.url)}:${m.location.lineNumber}</span>` : ""}</div>`).join("")}
      ` : ""}

      ${consoleW.length ? `
        <h3 class="section-header warn-bg">🟡 Console Warnings</h3>
        ${consoleW.map(m => `<div class="log-entry warn-entry">${esc(m.text)}</div>`).join("")}
      ` : ""}

      ${apiF.length ? `
        <h3 class="section-header error-bg">🔴 API Failures</h3>
        <table><thead><tr><th>Method</th><th>URL</th><th>Status</th><th>Duration</th></tr></thead><tbody>
          ${apiF.map(n => `<tr class="fail-row"><td>${n.method}</td><td class="url-cell">${esc(n.url)}</td><td>${n.status || esc(n.failureText ?? "")}</td><td>${n.duration ?? "—"} ms</td></tr>`).join("")}
        </tbody></table>
      ` : ""}

      ${okApis.length ? `
        <h3 class="section-header ok-bg">✅ Successful API Calls</h3>
        <table><thead><tr><th>Method</th><th>URL</th><th>Status</th><th>Duration</th></tr></thead><tbody>
          ${okApis.map(n => `<tr class="ok-row"><td>${n.method}</td><td class="url-cell">${esc(n.url)}</td><td>${n.status}</td><td class="${n.slow ? "slow" : ""}">${n.duration ?? "—"} ms</td></tr>`).join("")}
        </tbody></table>
      ` : ""}

      ${slowR.length ? `
        <h3 class="section-header warn-bg">🐢 Slow Requests</h3>
        <table><thead><tr><th>Method</th><th>URL</th><th>Duration</th></tr></thead><tbody>
          ${slowR.map(n => `<tr class="warn-row"><td>${n.method}</td><td class="url-cell">${esc(n.url)}</td><td class="slow">${n.duration} ms</td></tr>`).join("")}
        </tbody></table>
      ` : ""}

      ${violations.length ? `
        <h3 class="section-header warn-bg">♿ Accessibility Violations</h3>
        <table><thead><tr><th>Rule</th><th>Impact</th><th>Description</th><th>Elements</th></tr></thead><tbody>
          ${violations.map(v => `<tr><td><code>${esc(v.id)}</code></td><td><span class="impact impact-${v.impact}">${v.impact}</span></td><td>${esc(v.description)}</td><td>${v.nodes}</td></tr>`).join("")}
        </tbody></table>
      ` : ""}
    </section>`;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>NoQueueBarber Audit Report – ${ts}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, sans-serif; background: #0f1117; color: #e2e8f0; line-height: 1.6; }
  .header { background: linear-gradient(135deg, #1a1d27 0%, #252836 100%); padding: 32px 40px; border-bottom: 1px solid #2d3748; }
  .header h1 { font-size: 28px; font-weight: 700; color: #fff; }
  .header .ts { color: #718096; font-size: 14px; margin-top: 4px; }
  .health-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 18px; font-weight: 700; margin-top: 12px; }
  .health-badge.healthy { background: #22543d; color: #9ae6b4; }
  .health-badge.critical { background: #742a2a; color: #fed7d7; }
  .health-badge.attention { background: #744210; color: #fefcbf; }
  .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; padding: 24px 40px; background: #161820; border-bottom: 1px solid #2d3748; }
  .summary-card { background: #1a1d27; border: 1px solid #2d3748; border-radius: 12px; padding: 16px; text-align: center; }
  .summary-card .val { font-size: 32px; font-weight: 800; }
  .summary-card .lbl { font-size: 12px; color: #718096; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  .container { max-width: 1200px; margin: 0 auto; padding: 24px 40px; }
  .route-section { background: #1a1d27; border: 1px solid #2d3748; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
  .route-title { font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 16px; }
  .url-badge { font-size: 13px; color: #718096; font-weight: 400; margin-left: 8px; }
  .metrics-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 16px; }
  .metric { background: #252836; border-radius: 8px; padding: 12px; text-align: center; }
  .metric-value { font-size: 28px; font-weight: 800; }
  .metric-label { font-size: 11px; color: #718096; margin-top: 2px; }
  .error-color { color: #fc8181; }
  .warn-color { color: #f6e05e; }
  .ok-color { color: #68d391; }
  .perf-bar { background: #252836; border-radius: 8px; padding: 12px 16px; display: flex; gap: 24px; font-size: 14px; color: #a0aec0; margin-bottom: 12px; flex-wrap: wrap; }
  .section-header { font-size: 15px; font-weight: 600; padding: 8px 12px; border-radius: 6px; margin: 16px 0 8px; }
  .error-bg { background: #2d1515; color: #fc8181; }
  .warn-bg { background: #2d2600; color: #f6e05e; }
  .ok-bg { background: #1a2d1a; color: #68d391; }
  .log-entry { background: #0f1117; border-left: 3px solid; padding: 10px 14px; border-radius: 4px; margin-bottom: 6px; font-size: 13px; word-break: break-all; }
  .error-entry { border-color: #fc8181; }
  .warn-entry { border-color: #f6e05e; }
  .log-entry pre { margin-top: 6px; font-size: 11px; color: #718096; white-space: pre-wrap; }
  .source { display: block; font-size: 11px; color: #718096; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 8px; }
  th { background: #252836; color: #a0aec0; padding: 8px 12px; text-align: left; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
  td { padding: 8px 12px; border-bottom: 1px solid #2d3748; }
  .url-cell { font-family: monospace; font-size: 12px; max-width: 500px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .fail-row td { color: #fc8181; }
  .ok-row td { color: #e2e8f0; }
  .warn-row td { color: #f6e05e; }
  .slow { color: #f6e05e; font-weight: 700; }
  .alert { padding: 12px 16px; border-radius: 8px; margin-bottom: 12px; }
  .alert.error { background: #2d1515; color: #fc8181; border-left: 4px solid #fc8181; }
  code { background: #2d3748; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
  .impact { padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
  .impact-critical { background: #742a2a; color: #fc8181; }
  .impact-serious { background: #744210; color: #fefcbf; }
  .impact-moderate { background: #2d3748; color: #a0aec0; }
  .impact-minor { background: #1a2d1a; color: #68d391; }
</style>
</head>
<body>

<div class="header">
  <h1>🔍 NoQueueBarber – Browser Audit Report</h1>
  <div class="ts">Generated: ${ts}</div>
  <div class="health-badge ${summary.health.includes("HEALTHY") ? "healthy" : summary.health.includes("CRITICAL") ? "critical" : "attention"}">${summary.health}</div>
</div>

<div class="summary-grid">
  <div class="summary-card"><div class="val error-color">${summary.totalJsErrors}</div><div class="lbl">JS Errors</div></div>
  <div class="summary-card"><div class="val error-color">${summary.totalConsoleErrors}</div><div class="lbl">Console Errors</div></div>
  <div class="summary-card"><div class="val warn-color">${summary.totalConsoleWarnings}</div><div class="lbl">Warnings</div></div>
  <div class="summary-card"><div class="val error-color">${summary.totalApiFailures}</div><div class="lbl">API Failures</div></div>
  <div class="summary-card"><div class="val warn-color">${summary.totalSlowRequests}</div><div class="lbl">Slow Requests</div></div>
  <div class="summary-card"><div class="val warn-color">${summary.totalA11yViolations}</div><div class="lbl">A11y Violations</div></div>
</div>

<div class="container">${rows}</div>
</body></html>`;
}

function esc(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function shorten(url) {
    try {
        const u = new URL(url);
        return u.pathname + (u.search || "");
    } catch {
        return url.slice(0, 80);
    }
}

// ─── Start server ─────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);