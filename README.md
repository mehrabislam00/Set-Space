# SetSpace — Creative Studio Rental Marketplace

\<p align="center">
&#x20; \<strong>Discover. Book. Create.\</strong>
\</p>

\<p align="center">   A modern marketplace connecting creative professionals with studios and creative spaces. \</p>

\<p align="center">   \<a href="[https://set-space-ten.vercel.app/](https://set-space-ten.vercel.app/)">Live Website\</a> ·   \<a href="[https://github.com/mehrabislam00/Set-Space](https://github.com/mehrabislam00/Set-Space)">Frontend Repository\</a> ·   \<a href="[https://github.com/mehrabislam00/set-space-backend](https://github.com/mehrabislam00/set-space-backend)">Backend Repository\</a> \</p>

---

## Overview

**SetSpace** is a full-stack creative studio rental marketplace designed to connect creators, photographers, filmmakers, podcasters, musicians, and other creative professionals with suitable studio spaces.

The platform provides a centralized experience where users can discover creative studios, explore their facilities, check availability, and submit booking requests. Studio owners can also list their spaces, manage their listings, configure opening hours, and handle incoming booking requests.

SetSpace aims to make finding and renting creative spaces easier through an intuitive interface, organized studio listings, and dedicated dashboards for renters and hosts.

## Live Demo

**Explore SetSpace:** [https://set-space-ten.vercel.app/](https://set-space-ten.vercel.app/)

## Features

### Studio Discovery & Exploration

- Browse available creative studios.
- Search studios by name and location.
- Filter and sort listings based on relevant criteria.
- Explore studios by creative categories.
- View detailed studio information, photographs, amenities, and facilities.
- Explore studio ratings, reviews, and opening hours.
- Discover similar studio recommendations.

### Booking Management

- Submit studio booking requests.
- Select booking dates and time slots.
- View booking details and booking status.
- Track upcoming and previous bookings.
- Manage booking requests through dedicated dashboards.
- Receive booking-related notifications.

### User Dashboard

- Personalized user dashboard.
- Manage personal profile information.
- Upload and update profile pictures.
- View booking history and upcoming bookings.
- Save favorite studios to a wishlist.
- Manage notifications.
- Customize account preferences and appearance settings.

### Host Dashboard

- Dedicated host dashboard.
- Create and manage studio listings.
- Edit existing studio information.
- Upload studio photographs.
- Configure studio pricing and opening hours.
- Manage studio availability and unavailable dates.
- Publish or maintain studio listings.
- Review incoming booking requests.
- Accept or reject booking requests.
- Monitor studio performance and booking statistics.

### Authentication & Account Management

- User registration and login.
- Email and password authentication.
- Google authentication integration.
- Secure session management using Better Auth.
- Protected user and host functionality.

### Additional Features

- Responsive user interface.
- Light and dark theme support.
- Smooth page transitions and interactive animations.
- FAQ and help sections.
- Contact form.
- Newsletter subscription.
- Privacy policy and terms of service pages.

## Technology Stack

| Category            | Technologies              |
| ------------------- | ------------------------- |
| Framework           | Next.js 16                |
| Frontend Library    | React 19                  |
| Language            | TypeScript                |
| Styling             | Tailwind CSS 4            |
| Authentication      | Better Auth               |
| Database            | MongoDB                   |
| Backend Integration | REST API                  |
| Backend Framework   | Express.js 5              |
| UI Components       | shadcn/ui, Base UI        |
| Icons               | Lucide React, React Icons |
| Charts              | Recharts                  |
| Theme Management    | next-themes               |
| Date Utilities      | date-fns                  |
| Code Highlighting   | Shiki                     |
| Deployment          | Vercel                    |
| Version Control     | Git & GitHub              |

## Project Architecture

The frontend follows a modular and component-based architecture using the Next.js App Router.

```text
Set-Space/
│
├── app/                         # Application routes and layouts
│   ├── (auth)/                  # Authentication pages
│   ├── about/                   # About page
│   ├── api/auth/                # Better Auth API handler
│   ├── contact/                 # Contact page
│   ├── dashbord/                # User dashboard
│   ├── explore-studio/          # Studio exploration and details
│   ├── host/                    # Host dashboard and management
│   ├── how-it-works/            # Platform workflow
│   ├── studios/                 # Studio listings and details
│   ├── privacy/                 # Privacy policy
│   ├── terms/                   # Terms of service
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
│
├── assets/                      # Static assets and images
│
├── components/                  # Reusable UI components
│   ├── About/
│   ├── Animation/
│   ├── Auth/
│   ├── Contact/
│   ├── Dashboard/
│   ├── Explore studios/
│   ├── Footer/
│   ├── Host/
│   ├── Home/
│   ├── Navbar/
│   ├── Notifications/
│   ├── Studio card/
│   ├── Studio Detail/
│   ├── ui/                      # Reusable UI primitives
│   └── theme-provider.tsx
│
├── hooks/                       # Custom React hooks
│
├── lib/                         # API clients and utilities
│   ├── auth-client.ts
│   ├── auth.ts
│   ├── Booking-api.ts
│   ├── Dashboard-data.ts
│   ├── Host-data.ts
│   ├── Marketplace-api.ts
│   ├── Studio-api.ts
│   ├── Studio-store.ts
│   └── utils.ts
│
├── public/                      # Public static files
│
├── components.json
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Application Architecture

SetSpace separates its frontend presentation, authentication, and marketplace operations into dedicated modules.

### Frontend

- Next.js App Router handles routing and page layouts.
- React components are organized by application features.
- Shared components provide consistent UI across the application.
- Custom hooks handle reusable client-side logic.
- API clients manage communication with the backend.
- Context providers manage shared application state.

### Authentication

Better Auth handles user authentication through the Next.js API route:

`/api/auth/[...all]`

The authentication system supports email/password and configured Google sign-in.

### Backend Communication

The frontend communicates with a separate Express.js backend through REST APIs.

The integration handles:

- Studio management.
- Booking requests.
- User profiles.
- Reviews.
- Wishlist management.
- Notifications.
- Dashboard statistics.
- Contact messages.
- Newsletter subscriptions.

### Database Architecture

The application uses MongoDB with two separate databases within the same cluster:

| Database   | Responsibility                                                     |
| ---------- | ------------------------------------------------------------------ |
| `auth`     | Better Auth users, sessions, accounts, and verification records    |
| `SetSpace` | Studios, bookings, reviews, profiles, wishlists, and notifications |

The backend validates Better Auth sessions before processing protected operations.

## Getting Started

Follow these instructions to run the frontend locally.

### Prerequisites

Make sure you have installed:

- Node.js (version supported by Next.js 16).
- npm.
- Git.
- MongoDB Atlas account.
- Google OAuth credentials (if enabling Google sign-in).

### 1. Clone the Repository

```bash
git clone https://github.com/mehrabislam00/Set-Space.git
```

### 2. Navigate to the Project

```bash
cd Set-Space
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root.

```env
# Better Auth MongoDB Connection
BETTER_AUTH_MONGO_URI=your_mongodb_connection_string

# MongoDB Credentials (if required by your connection URI)
MONGODB_USERNAME=your_mongodb_username
MONGODB_PASSWORD=your_mongodb_password

# Better Auth Configuration
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Important:**

- Configure the MongoDB connection using your own credentials.
- The authentication database is named `auth`.
- Google OAuth credentials are required only when using Google sign-in.
- Keep all sensitive credentials private.
- Never commit `.env.local` to GitHub.
- Use the same MongoDB cluster and authentication configuration for both frontend and backend.

### 5. Start the Backend

Clone and configure the companion backend separately.

```bash
git clone https://github.com/mehrabislam00/set-space-backend.git

cd set-space-backend

npm install
```

Configure the backend `.env` file using the environment variables documented in the backend repository.

Start the backend development server:

```bash
npm run dev
```

The backend runs on:

`http://localhost:5000`

### 6. Start the Frontend

Open another terminal in the frontend project directory.

```bash
npm run dev
```

Open your browser and visit:

`http://localhost:3000`

## Available Scripts

| Command             | Description                  |
| ------------------- | ---------------------------- |
| `npm run dev`       | Start the development server |
| `npm run build`     | Create a production build    |
| `npm run start`     | Start the production server  |
| `npm run lint`      | Run ESLint                   |
| `npm run typecheck` | Run TypeScript checks        |
| `npm run format`    | Format project files         |

## Deployment

The frontend is deployed using **Vercel**.

For production deployment:

1. Import the frontend repository into Vercel.
2. Configure the required environment variables.
3. Set `NEXT_PUBLIC_API_URL` to the deployed backend API URL.
4. Configure the backend's `CLIENT_URI` to allow the production frontend origin.
5. Set `BETTER_AUTH_URL` to the production frontend URL in the appropriate environments.
6. Ensure both applications use the same authentication database and compatible session configuration.
7. Deploy both applications and verify their API communication.

## Project Repositories

| Project      | Link                                                                       |
| ------------ | -------------------------------------------------------------------------- |
| Live Website | [SetSpace](https://set-space-ten.vercel.app/)                              |
| Frontend     | [SetSpace Frontend](https://github.com/mehrabislam00/Set-Space)            |
| Backend      | [SetSpace Backend API](https://github.com/mehrabislam00/set-space-backend) |

## Current Project Scope

SetSpace currently supports studio discovery, booking requests, host management, user dashboards, and related marketplace functionality.

**Note:** Booking requests and status management are implemented. Online payment gateway integration is not currently included.

## Future Improvements

Potential areas for further development include:

- Online payment gateway integration.
- Automated end-to-end testing.
- Advanced booking and availability management.
- Additional marketplace analytics.
- Further improvements to the overall user experience.

---

\<p align="center">
&#x20; Built with passion for the creative community.
\</p>

\<p align="center">
&#x20; \<strong>SetSpace — Create. Rent. Inspire.\</strong>
\</p>
