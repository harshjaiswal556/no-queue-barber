# NoQueueBarber – Browser Audit MCP Server

A custom MCP server that **opens a real Chromium window**, crawls every
route of your NoQueueBarber React app, and produces a complete audit report.

---

## What it captures

| Category                | Details                                                         |
| ----------------------- | --------------------------------------------------------------- |
| **Console Errors**      | Every `console.error()` call, uncaught rejections, React errors |
| **Console Warnings**    | Every `console.warn()`, deprecation notices                     |
| **JS Runtime Errors**   | Uncaught exceptions (`window.onerror`)                          |
| **API Failures**        | Any `/api/*` request returning 4xx or 5xx                       |
| **Network Failures**    | DNS errors, CORS blocks, connection refused                     |
| **Slow Requests**       | Requests exceeding your threshold (default 2000 ms)             |
| **Performance Metrics** | FCP, DOM Content Loaded, Load Complete, Transfer Size           |
| **Accessibility**       | axe-core violations per route (impact level, rule, count)       |

---

## Setup

```bash
# 1 – clone / copy this folder next to your project
cd noqueue-audit-mcp
npm install
npx playwright install chromium   # download the browser once
```

---

## Register in Claude Desktop (MCP config)

Open `~/Library/Application Support/Claude/claude_desktop_config.json`
(macOS) and add:

```jsonc
{
  "mcpServers": {
    "noqueue-audit": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/noqueue-audit-mcp/index.js"],
    },
  },
}
```

Restart Claude Desktop. You will see the 🔨 tool icon appear.

---

## Using in Claude

Once registered, just say:

```
Run audit_app on http://localhost:5173
```

Or with options:

```
Run audit_app with:
  base_url: "http://localhost:5173"
  headless: false          ← opens a real browser window you can watch
  slow_request_threshold_ms: 1000
  routes: ["/stores", "/dashboard", "/contact"]
  auth: { email: "test@test.com", password: "Test@1234" }
  save_report: true        ← saves audit-report.html next to index.js
```

---

## Tool Input Schema

```json
{
  "base_url": "http://localhost:5173",
  "routes": ["/", "/stores", "/dashboard", "/contact"],
  "slow_request_threshold_ms": 2000,
  "headless": false,
  "save_report": true,
  "auth": {
    "email": "barber@test.com",
    "password": "Secret@123"
  }
}
```

All fields are **optional** – sensible defaults are applied.

---

## Output

1. **Markdown report** returned inline in Claude's chat
2. **`audit-report.html`** saved in this folder (dark-theme, fully styled)

The HTML report includes:

- Per-route metric tiles (errors, warnings, API failures, slow requests)
- Performance bar (FCP, DCL, Load, Size)
- Filterable tables for API calls, failures, slow requests
- Accessibility violation table with impact badges
