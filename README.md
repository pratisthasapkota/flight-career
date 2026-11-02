# Fullstack Aviation App

React client + Express/Drizzle ORM API backed by PostgreSQL.

## Project layout

- `client/` - React 18 (Create React App), axios, react-router
- `server/` - Express, TypeScript, Drizzle ORM, PostgreSQL (`pg`)
- `server/db/migrations/` - ordered SQL migrations
- `docker-compose.yml` - PostgreSQL, API and nginx client

## Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Docker (optional)

## Environment

Copy the sample file and set real values. Never commit `.env`.

```bash
cp .env.sample .env
```

Important variables:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` **or** `DB_HOST`/`DB_PORT`/`DB_USER`/`DB_PASSWORD`/`DB_NAME` | PostgreSQL connection |
| `DB_SSL` | Set `true` for managed databases that require TLS |
| `DB_POOL_MAX` | Connection pool size (default `10`) |
| `JWT_SECRET`, `SESSION_SECRET` | Required, at least 24 characters |
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins |
| `COOKIE_SAME_SITE` | `lax` for same-site/local, `none` for cross-site HTTPS |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` | Optional bootstrap admin account |

Generate secrets:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Generate an admin password hash:

```bash
node -e "require('bcrypt').hash('YOUR_PASSWORD',10).then(console.log)"
```

## Local setup

```bash
# 1. Install dependencies
npm install --prefix server
npm install --prefix client

# 2. Create the database (example)
createdb -U postgres login

# 3. Run migrations
npm run db:migrate --prefix server

# 4. Start API and client
npm run both
```

The API runs on `http://localhost:5000` and the client on `http://localhost:3000`.

## Admin access

Admin identity is stored in the database (`login.is_admin` / `users.is_admin`),
not in frontend state or browser storage.

- On startup, `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` creates or promotes that
  account and sets `is_admin = true`. The password hash is only used when the
  account is first created; restarting never overwrites an existing password.
- Grant/revoke an existing account from the server:

```bash
npm run admin:grant --prefix server -- someone@example.com
npm run admin:grant --prefix server -- someone@example.com --revoke
```

Admin sessions use an HttpOnly JWT cookie (`admin_token`), a readable CSRF
cookie (`admin_csrf`) with double-submit validation, and a sliding 24-hour
expiry refreshed through `GET /api/admin/session`.

## Database migrations

Migrations are plain SQL files in `server/db/migrations`, applied in filename
order and tracked in `schema_migrations`. The server also runs them on startup.
An advisory lock prevents concurrent migration runs.

```bash
npm run db:migrate --prefix server
```

## Indexes

Indexes are based on actual query patterns, including:

- Unique indexes on `login.email`, `users.email`, `payment_sessions.session_id`
- `products(active)`, `college(active)`, `faq(active, sort_order)`
- `guide(category, active)` (category lookup)
- `vacancy(lower(role))` for case-insensitive role filtering
- Order lookup/date/sort indexes on `product`
- Admin list date indexes on applications/interests
- Vacancy application foreign key and duplicate-check indexes

## Docker

```bash
docker compose up --build
```

The compose file provisions PostgreSQL, waits for its health check, runs the API
(image contains the migration runner), and serves the client through nginx.
Set `COOKIE_SAME_SITE=lax` for local plain-HTTP Docker; use `none` behind HTTPS.

## Verification

```bash
npm run typecheck --prefix server
npx --prefix client tsc --noEmit
npm run build --prefix client
```

Manual checks: admin login, refresh `/admin/dashboard`, logout, logout while
offline (session should be retained on transient errors), regular-user access
to `/api/admin/*` should return `403`, and no browser-native dialogs should
appear for destructive actions.
