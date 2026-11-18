# SetSpace Frontend

SetSpace is a studio-rental marketplace for people looking to book creative
spaces and hosts who want to list and manage their studios. This repository
contains the Next.js web application; marketplace data and authenticated
operations are provided by the companion Express API.

## Project overview

The application includes public studio discovery and details, renter and host
dashboards, Better Auth sign-in, and supporting pages such as contact, FAQ,
privacy, and terms. It is built with the Next.js App Router and keeps shared UI,
data helpers, and API clients in their own project folders.

## Features

- Browse, search, filter, and sort studio listings.
- View studio photos, amenities, ratings, reviews, host contact options, and
  weekly opening hours.
- Submit booking requests and follow booking statuses.
- Hosts can create, edit, publish, and remove studio listings, configure weekly
  availability, and respond to booking requests.
- Save studios to a wishlist and view account notifications.
- Manage profile details and profile image.
- Sign in or register with email/password; Google sign-in is also configured.
- Light and dark themes.
- Public marketing pages, contact form, and newsletter subscription.

Booking requests and their statuses are implemented; a payment gateway is not
configured in this repository.

## Main user workflows

1. A renter explores studios at `/explore-studio`, opens a listing, and submits
   a booking request.
2. The renter can review saved studios, bookings, profile information, and
   notifications from the dashboard.
3. A host signs in, creates or edits a studio, sets its opening hours, and
   manages booking requests in the host area.
4. Eligible renters can submit a review after a completed booking.

## Technology stack

### Runtime dependencies

| Area | Libraries |
| --- | --- |
| Framework and UI | Next.js 16, React 19, React DOM |
| Language and styling | TypeScript, Tailwind CSS 4, PostCSS |
| Authentication and data | Better Auth, `@better-auth/mongo-adapter`, MongoDB Node.js driver |
| Theme | `next-themes` |
| UI primitives and styling | Base UI, shadcn, `@shadcn/react`, `class-variance-authority`, `cn`, `cmdk`, `input-otp`, `react-day-picker`, `react-resizable-panels` |
| Icons, charts, and interaction | `lucide-react`, `react-icons`, `recharts`, `embla-carousel-react`, `tw-animate-css` |
| Utilities | `date-fns`, `shiki` |

### Development dependencies

`@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom`,
`eslint`, `eslint-config-next`, `prettier`, `prettier-plugin-tailwindcss`,
`tailwindcss`, and `typescript`.

The exact versions are maintained in [`package.json`](./package.json) and
[`package-lock.json`](./package-lock.json).

## Authentication

Better Auth is served by the Next.js route at
`/api/auth/[...all]`. Email/password and Google sign-in are configured. Better
Auth stores its records in the MongoDB database named `auth` (lowercase).

The browser uses the Better Auth session for sign-in state. The Express API
checks protected requests against the Better Auth session endpoint; it does
not trust a user ID supplied by the browser. The browser auth client uses the
current frontend origin so sign-in cookies stay on the deployed frontend host.

## Architecture

```text
app/
  (auth)/                 Sign-in and registration pages
  api/auth/[...all]/      Better Auth Next.js handler
  dashbord/               Renter dashboard pages
  explore-studio/         Studio discovery and detail routes
  host/                   Host dashboard and studio management
components/               Page sections, shared UI, and marketplace components
hooks/                    Reusable React hooks
lib/
  Marketplace-api.ts      Express API client and response types
  Studio-api.ts           Maps API records to UI models
  Studio-store.ts         Host listing state and mutations
  Site-data.ts            Shared site and presentation data
  Host-data.ts            Host form and display types/data
  Studio-filters.ts       Listing filter helpers
assets/                   Imported site imagery and logo
```

The `app/dashbord` directory spelling is intentional for compatibility. A
rewrite in `next.config.ts` maps `/dashboard/*` URLs to it.

Global layout, typography, theme, and styles live in `app/layout.tsx` and
`app/*.css`. Marketing copy and some presentation data are maintained in
`lib/`; marketplace operations are routed through the API client.

## API integration

The frontend API client uses `NEXT_PUBLIC_API_URL`, defaulting to
`http://localhost:5000`. Browser requests use a same-origin Next.js rewrite
proxy, which forwards the Better Auth session cookie to the backend without
requiring the browser to send a cookie to a different host. Server-rendered
public API requests use `NEXT_PUBLIC_API_URL` directly.

The frontend uses API routes for profiles, studios, bookings, reviews,
wishlists, dashboard statistics, notifications, host contact details, contact
messages, and newsletter subscriptions. The backend repository documents the
full endpoint list and authentication requirements.

For local development, run the frontend and backend on ports `3000` and `5000`
respectively, and configure both to use the same MongoDB cluster and auth
database.

## Environment setup

Create `.env.local` in the frontend repository root. Do not commit credentials.

```dotenv
# MongoDB URI used by Better Auth. Configure it for the same Atlas cluster
# used by the Express API. The database name is selected as "auth" in code.
BETTER_AUTH_MONGO_URI=YOUR_MONGODB_CONNECTION_URI

# If the URI contains the literal placeholders
# <MONGODB_USERNAME> and <MONGODB_PASSWORD>, provide these values too.
MONGODB_USERNAME=YOUR_MONGODB_USERNAME
MONGODB_PASSWORD=YOUR_MONGODB_PASSWORD

# Better Auth base URL for server-side auth/session checks
BETTER_AUTH_URL=http://localhost:3000

# Needed when enabling the configured Google sign-in provider
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

# Express API base URL; defaults to http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

`BETTER_AUTH_MONGO_URI` is required by the current auth configuration. Google
credentials are needed for Google sign-in; email/password is also enabled.
Use deployment-specific values for production and never expose secrets through
`NEXT_PUBLIC_*` variables.

## Installation and local development

Use a Node.js release supported by the installed Next.js version.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Start the companion backend separately; its
local setup is documented in the backend repository's README.

Useful project scripts:

```bash
npm run lint
npm run typecheck
npm run format
```

## Build and production

```bash
npm run build
npm run start
```

Set the production environment variables before building or starting the
application. Deploy as a Next.js Node.js application and configure
`NEXT_PUBLIC_API_URL` to point to the deployed Express API. Set `BETTER_AUTH_URL`
to the production frontend URL in the backend deployment, and allow that
frontend origin through the backend's CORS configuration.

## Screenshots

Add current screenshots to the repository (for example, under
`docs/screenshots/`) and replace these placeholders:

| Page | Screenshot |
| --- | --- |
| Home | `YOUR_HOME_SCREENSHOT_PATH_OR_URL` |
| Studio discovery | `YOUR_STUDIO_DISCOVERY_SCREENSHOT_PATH_OR_URL` |
| Studio details | `YOUR_STUDIO_DETAILS_SCREENSHOT_PATH_OR_URL` |
| Renter dashboard | `YOUR_RENTER_DASHBOARD_SCREENSHOT_PATH_OR_URL` |
| Host dashboard | `YOUR_HOST_DASHBOARD_SCREENSHOT_PATH_OR_URL` |

## Project links

- Live Website: `YOUR_LIVE_WEBSITE_URL`
- Frontend Repository: `YOUR_FRONTEND_GITHUB_REPOSITORY_URL`
- Backend Repository: `YOUR_BACKEND_GITHUB_REPOSITORY_URL`

## Possible future improvements

- Integrate a payment provider if online payment is added to the booking flow.
- Add automated browser and end-to-end coverage for the main renter and host
  workflows.
