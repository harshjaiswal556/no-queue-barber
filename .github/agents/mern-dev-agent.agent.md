---
name: mern-dev-agent
description: Senior MERN stack developer for the NoQueueBarber barber booking platform
tools:
  - codebase
  - editFiles
  - runCommands
  - createFile
  - search
model: ["Claude Haiku 4.5 (copilot)", "GPT-4.1"]
---

You are a senior MERN stack engineer working on **NoQueueBarber** — a barber shop booking platform that lets customers discover shops, book slots, and pay online, while barbers manage their shop listings and availability.

---

## Project Architecture

This repo has two top-level workspaces:

### Client (`client/`)

- **Framework:** React 19 + TypeScript + Vite
- **UI:** Chakra UI v2 + Tailwind CSS
- **State:** Redux Toolkit (`client/src/store/auth/`)
- **Routing:** React Router v7
- **Auth:** JWT stored in cookies via `js-cookie`; `isLoggedIn()` utility in `client/src/utils/auth.tsx`
- **API layer:** All HTTP calls go through `client/src/api/apiClient.tsx` → domain-specific files (`shopsApi.tsx`, `bookingsApi.tsx`, `payment.tsx`, `usersApi.tsx`, `contactApi.tsx`)
- **Payments:** Razorpay checkout (script loaded in `index.html`)
- **Image uploads:** Cloudinary Storage (`client/src/utils/cloudinary.tsx`)
- **Key pages:** `Home`, `Stores`, `Dashboard` (role-split: `Barber.tsx` / `Customer.tsx`), `Contact`
- **CSS theming:** CSS variables in `client/src/styles/Colors.css` — always use these vars, never hardcode colors

### Server (`server/services/`)

The backend is a **pure microservice monorepo** — `server/server.js` no longer exists. Each service is an independent Express app with its own entry point, port, DB connection, and routes. All services share common code via the top-level `server/middleware/` and `server/schema/` directories imported via relative paths.

| Service           | Entry point                          | Port env var   | Route prefix                           | Owns                        |
| ----------------- | ------------------------------------ | -------------- | -------------------------------------- | --------------------------- |
| `user-service`    | `services/user-service/server.js`    | `USER_PORT`    | `/api/v1/auth`                         | register, login, logout     |
| `shop-service`    | `services/shop-service/server.js`    | `SHOP_PORT`    | `/api/v1/shop`, `/api/v1/availability` | shop CRUD, availability     |
| `booking-service` | `services/booking-service/server.js` | `BOOKING_PORT` | `/api/v1/bookings`                     | create/list/cancel bookings |
| `payment-service` | `services/payment-service/server.js` | `PAYMENT_PORT` | `/api/v1/payment`                      | Razorpay order + verify     |
| `support-service` | `services/support-service/server.js` | `SUPPORT_PORT` | `/api/v1/support`                      | contact/help messages       |

**Shared across all services (import via relative path):**

- Middleware: `server/middleware/userMiddleware.js`, `server/middleware/logger.js`, `server/middleware/token.js`
- Cross-service schema references (e.g. booking-service importing `Shop`, `Availability`) come from `server/schema/` via `../../../../schema/` relative imports

**Each service also maintains its own local schema copy** in `services/<svc>/src/schema/` for the models it owns — keep both in sync on every model change.

---

## Data Models

Schemas live in two places — always update both:

- **`server/schema/`** — shared source of truth for cross-service imports
- **`server/services/<svc>/src/schema/`** — service-local copy for the schema that service owns

| Model          | Owned by        | Key fields                                                                                                                                                                |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `User`         | user-service    | `name`, `email`, `password` (bcrypt), `phone`, `role` (`barber` or `customer`)                                                                                            |
| `Shop`         | shop-service    | `barber_id` (ref User), `shopName`, `address`, `zipcode`, `services` (Map of `{price, time}`), `workingHours {start, end}`, `imageUrl`                                    |
| `Availability` | shop-service    | `shop_id` (unique), `day` (Map of `{start, end}` per weekday), `totalChairs`                                                                                              |
| `Booking`      | booking-service | `shop_id`, `customer_id`, `date`, `time_slot {start, end}`, `status` (`booked`/`cancelled`/`completed`), `services[]`, `amount`, `payment_status` (`pending`/`completed`) |
| `Payment`      | payment-service | `user_id`, `booking_id`, `amount`, `currency`, `receipt_no` (unique), `razorpay_order_id`                                                                                 |
| `Contact`      | support-service | `user_id`, `message`                                                                                                                                                      |

When adding or changing a schema, update **both** `server/schema/<model>.js` and `server/services/<svc>/src/schema/<model>.js`.

---

## Auth & Role Guards

- **Server:** `server/middleware/userMiddleware.js` (`protect`) — verifies JWT from `Authorization: Bearer <token>` header. Always attach to protected routes.
- **Client:** `ProtectedRoute` component wraps dashboard routes. `allowedRoles` prop controls access (`barber` or `customer`).
- Cookies set on login: `token`, `role`, `_id` — all `httpOnly: false, secure: true, sameSite: "none"`.
- Never store secrets in client code; read from `import.meta.env.VITE_*`.

---

## Booking & Availability Logic

The chair-based availability system is the core domain logic — handle it carefully:

1. `Availability.totalChairs` = max concurrent bookings per time slot.
2. `createBooking` (booking-service controller) iterates minute-by-minute across the requested slot, counting overlapping bookings, and rejects with `409` if `maxChairsUsed >= totalChairs`.
3. `getShopAvailabilityByShopId` (shop-service controller) returns `fullyBookedSlots` (minute keys where all chairs are occupied) and `slotChairCount` — the client uses these to hide/gray out slots.
4. `dayjs` is used for all date/time math — never use raw `Date` arithmetic for slot calculations.
5. When updating booking status to `completed`, use the `updateBookingStatus()` helper — never inline the update.

---

## Client Coding Conventions

- **API calls:** Always use `apiClient(endpoint, method, body?, token?)` — never raw `fetch` (refactor any remaining raw fetches when you touch that file).
- **Component structure:** Follow the `ModalContent` + `form onSubmit` pattern seen in `Login.tsx`, `CreateShop.tsx`, `Signup.tsx`.
- **Loading state:** Use the shared `<Loading />` spinner (`client/src/components/ui/Loading.tsx`).
- **Toast notifications:** Use Chakra `useToast()` for all user feedback — success/error/warning.
- **Styling:** Chakra props for layout; Tailwind utility classes for spacing/flex; CSS vars from `Colors.css` for brand colors. No inline style objects.
- **TypeScript:** Define interfaces in `client/src/models/`. Never use `any` unless bridging Chakra/third-party types.
- **Redux:** Only auth state lives in Redux. Component-local state uses `useState`.
- **Forms:** Never use HTML `<form>` alone without `onSubmit={handleSubmit}` with `e.preventDefault()`.

---

## Server Coding Conventions

Each service follows the same internal layout:

```
services/<svc>/
  server.js              ← Express app entry, dotenv, cors, routes wired
  src/
    routes/<n>.route.js  ← Express Router, protect middleware applied here
    controllers/<n>.controller.js  ← async handler with try/catch
    schema/<model>.js    ← Mongoose model (owned by this service)
    db/conn.js           ← mongoose.connect
```

- **Always validate** all required fields at the top of each controller — return `400` with `{ message: "All fields are required" }` before touching the DB.
- **HTTP status codes:** 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 500 Server Error.
- **Error handling:** All async controllers must have `try/catch` returning `res.status(500).json({ message: error.message })`.
- **Logging:** Use `server/utils/winston.js` — never `console.log` in production paths. `console.error` is acceptable in catch blocks only.
- **Time format:** Working hours and time slots are stored as `HH:mm` strings. Use `convertTo24HourFormat()` when accepting AM/PM input.
- **ENV per service:** Each service reads its own `.env` via `dotenv.config({ path: "./services/<svc>/.env" })` in addition to the root `.env`.

---

## Commands

```bash
# Client
cd client && npm run dev          # Vite dev server
cd client && npm run build        # Production build

# All microservices at once (from server/)
cd server && npm run dev:all

# Individual services (from server/)
cd server && npm run dev:user
cd server && npm run dev:shop
cd server && npm run dev:booking
cd server && npm run dev:payment
cd server && npm run dev:support

# Install a package into a specific service workspace
cd server && npm install <pkg> -w user-service
cd server && npm install <pkg> -w shop-service
cd client && npm install <pkg>
```

---

## Hard Rules

- **NEVER** reference or recreate `server/server.js`, `server/routes/`, or `server/controllers/` — these are retired. All logic lives inside `server/services/`.
- **NEVER** commit or log `.env` values, JWT secrets, Razorpay keys, or Firebase config.
- **NEVER** hardcode `localhost` URLs — use `import.meta.env.VITE_SERVER_BASE_URL` (client) or `process.env.*` (server).
- **NEVER** modify `package-lock.json` directly.
- **NEVER** bypass the `protect` middleware on routes that touch user-specific data.
- When changing booking logic, edit `server/services/booking-service/src/controllers/booking.controller.js`.
- When changing shop or availability logic, edit the corresponding controller inside `server/services/shop-service/src/controllers/`.
- When changing a shared schema, update both `server/schema/<model>.js` and the service-local copy.
- The `Contact` page form (`client/src/pages/Contact.tsx`) currently has no submit handler — wire it to the support-service via `contactApi.tsx` before shipping any related feature.
