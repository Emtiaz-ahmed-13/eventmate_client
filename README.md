# EventMate Client

<p align="center">
  <img src="public/eventmate.png" alt="EventMate logo" width="600" />
</p>

<p align="center">
  <strong>Next.js frontend for discovering, hosting, joining, and managing local events.</strong>
</p>

<p align="center">
  <a href="https://eventmate-client-1.onrender.com/">Live App</a> |
  <a href="https://eventmate-server-5.onrender.com/">Backend API</a> |
  <a href="../eventmate_server/README.md">Server README</a>
</p>

## Overview

EventMate Client is the web application for the EventMate platform. It provides public event discovery, role-based dashboards, host event management, Stripe-powered paid joins, QR ticket scanning, reviews, real-time notifications, event chat, discussions, and admin moderation tools.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| UI | React 19, Tailwind CSS v4, shadcn/ui, Radix UI |
| Data fetching | Axios, TanStack React Query |
| State | Zustand |
| Forms and validation | React Hook Form, Zod |
| Payments | Stripe React SDK |
| Real-time | Socket.IO Client |
| Notifications | Sonner |
| Icons | Lucide React |

## Features

- Public home page with featured events, hosts, reviews, and calls to action.
- Authentication pages for login, registration, forgot password, and reset password.
- Event browsing with search, category, location, date range, paid-only filters, and pagination.
- Host tools for creating, editing, duplicating, cancelling, deleting, and analyzing events.
- User flows for joining free or paid events, saving events, viewing tickets, and reviewing hosts.
- Participant management with approval, rejection, waitlist, check-in, undo check-in, and QR ticket scan.
- Stripe Elements integration for paid events.
- Real-time notifications through Socket.IO.
- Event-specific chat and public discussion/Q&A.
- Host follow system and verified host discovery.
- Admin dashboard for users, hosts, events, host verification, event moderation, analytics, and system logs.

## Prerequisites

- Node.js 20 or later
- npm
- Running EventMate Server instance
- Stripe publishable key for paid-event checkout

## Getting Started

Install dependencies:

```bash
cd eventmate_client
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server with Turbopack |
| `npm run build` | Build the production app |
| `npm start` | Start the production server after building |

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL, for example `http://localhost:5001/api/v1` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key used by Stripe Elements |

## Project Structure

```text
eventmate_client/
|-- public/                 Static assets and EventMate logo
|-- src/
|   |-- app/                Next.js App Router pages and layouts
|   |-- components/         Reusable UI and feature components
|   |-- hooks/              Client hooks, including notifications
|   |-- lib/                Axios and Socket.IO clients
|   |-- services/           API service modules
|   |-- store/              Zustand stores
|   `-- components/ui/      Shared UI primitives
|-- Dockerfile              Production Docker image
|-- render.yaml             Render service config
|-- next.config.ts          Next.js config
`-- package.json            Scripts and dependencies
```

## Main Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Landing page |
| `/events` | Public | Browse and filter events |
| `/events/[id]` | Public/Auth | Event details, join, pay, review, chat, and discussion |
| `/events/create` | Host/Admin | Create an event |
| `/events/[id]/edit` | Host/Admin | Edit an event |
| `/events/[id]/analytics` | Host/Admin | Event analytics |
| `/dashboard` | Auth | Role-based user dashboard |
| `/dashboard/scan` | Host/Admin | QR ticket scanner |
| `/saved` | Auth | Saved events |
| `/hosts` | Public | Verified hosts |
| `/reviews` | Public | Community reviews |
| `/profile/[id]` | Public/Auth | User or host profile |
| `/admin` | Admin | Admin overview |
| `/admin/users` | Admin | User management |
| `/admin/hosts` | Admin | Host management |
| `/admin/events` | Admin | Event management |
| `/admin/host-verifications` | Admin | Host approval workflow |
| `/admin/event-shield` | Admin | Event moderation shield |
| `/admin/system-logs` | Admin | System logs |

## Backend Integration

The frontend uses `NEXT_PUBLIC_API_URL` as the REST API base URL. Socket.IO connects to the same backend origin after removing `/api/v1` from that URL.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
```

Socket.IO will connect to:

```text
http://localhost:5001
```

## Deployment

### Render

This project includes `render.yaml`.

```bash
npm install && npm run build
npm start
```

Set these environment variables in Render:

```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://your-backend-url/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_test_key
```

### Vercel

This project also includes `vercel.json` with Next.js framework detection.

Required Vercel environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_test_key
```

## Common Issues

- If API requests fail, confirm `NEXT_PUBLIC_API_URL` includes `/api/v1`.
- If real-time notifications do not connect, confirm the backend allows the frontend origin in `FRONTEND_URL`.
- If Stripe checkout does not load, confirm `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set and the backend has the matching Stripe secret key.
- If remote ImageKit images fail to render, confirm the URL host matches the allowed hosts in `next.config.ts`.

## Related

- [EventMate Server](../eventmate_server/README.md)
