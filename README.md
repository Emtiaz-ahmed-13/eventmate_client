# EventMate Client

Frontend for EventMate — a full-featured event management platform. Built with Next.js 16, TypeScript, Tailwind CSS, and Shadcn UI.

## Live App

```
https://eventmate-client.vercel.app
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | Shadcn UI + Radix UI |
| State Management | Zustand |
| Server State | TanStack React Query v5 |
| HTTP Client | Axios |
| Forms | React Hook Form + Zod |
| Payments | Stripe (React Stripe.js) |
| Notifications | Sonner (toast) |
| Icons | Lucide React |

---

## Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd eventmate_client
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

> For production, point `NEXT_PUBLIC_API_URL` to the live backend URL.

### 3. Run

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

App runs on `http://localhost:3000`

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Build for production |
| `npm start` | Start production server |

---

## Project Structure

```
eventmate_client/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── page.tsx                # Home page
│   │   ├── layout.tsx              # Root layout
│   │   ├── login/                  # Login page
│   │   ├── register/               # Register page
│   │   ├── forgot-password/        # Forgot password
│   │   ├── reset-password/         # Reset password
│   │   ├── verify-email/           # Email verification
│   │   ├── verify-email-sent/      # Post-register confirmation
│   │   ├── dashboard/              # User/Host/Admin dashboard
│   │   ├── events/
│   │   │   ├── page.tsx            # Browse all events
│   │   │   ├── create/             # Create new event (HOST)
│   │   │   └── [id]/
│   │   │       ├── page.tsx        # Event detail + join/leave/review
│   │   │       └── edit/           # Edit event (HOST)
│   │   ├── profile/[id]/           # User profile + reviews
│   │   ├── saved/                  # Saved/bookmarked events
│   │   ├── hosts/                  # Browse all hosts
│   │   └── admin/
│   │       ├── page.tsx            # Admin dashboard (real analytics)
│   │       ├── users/              # Manage users
│   │       ├── hosts/              # Manage hosts
│   │       ├── events/             # Manage events
│   │       ├── host-verifications/ # Verify host requests
│   │       ├── event-shield/       # Event moderation
│   │       └── system-logs/        # System activity logs
│   ├── components/
│   │   ├── Navbar.tsx              # Navigation bar
│   │   ├── PaymentForm.tsx         # Stripe payment form
│   │   ├── providers/
│   │   │   ├── QueryProvider.tsx   # TanStack Query provider
│   │   │   └── StripeProvider.tsx  # Stripe Elements provider
│   │   └── ui/                     # Shadcn UI components
│   ├── services/                   # API service layer
│   │   ├── auth.service.ts         # Auth endpoints
│   │   ├── event.service.ts        # Event CRUD + join/save/participants
│   │   ├── user.service.ts         # User profile + hosts
│   │   ├── review.service.ts       # Reviews
│   │   ├── payment.service.ts      # Stripe payments
│   │   ├── admin.service.ts        # Admin operations
│   │   └── analytics.service.ts   # Analytics overview
│   ├── store/
│   │   └── auth.store.ts           # Zustand auth state
│   └── lib/
│       ├── api.ts                  # Axios instance with interceptors
│       └── utils.ts                # Utility functions
├── public/                         # Static assets
├── .env.local                      # Environment variables (not committed)
└── package.json
```

---

## Pages & Features

### Public Pages
| Route | Description |
|---|---|
| `/` | Home — trending events, featured hosts, CTA |
| `/events` | Browse & search all events |
| `/events/:id` | Event detail — join, save, payment, review |
| `/hosts` | Browse all verified hosts |
| `/login` | Login |
| `/register` | Register (USER or HOST role) |
| `/forgot-password` | Request password reset |
| `/reset-password` | Set new password via token |
| `/verify-email` | Email verification |

### Authenticated Pages
| Route | Role | Description |
|---|---|---|
| `/dashboard` | All | Role-based dashboard |
| `/profile/:id` | All | View/edit profile, see reviews |
| `/saved` | All | Saved/bookmarked events |
| `/events/create` | HOST | Create new event |
| `/events/:id/edit` | HOST | Edit, cancel, or delete event |

### Admin Pages
| Route | Description |
|---|---|
| `/admin` | Dashboard with real analytics |
| `/admin/users` | Manage users — ban, role change, delete |
| `/admin/hosts` | View all hosts |
| `/admin/host-verifications` | Approve/reject host requests |
| `/admin/events` | View and delete any event |
| `/admin/event-shield` | Event moderation tools |
| `/admin/system-logs` | System activity logs |

---

## Key Features

**Authentication**
- JWT-based login with access + refresh tokens
- Email verification on register
- Forgot/reset password flow
- Persistent auth state via Zustand

**Events**
- Browse with search and filters
- Create events with image upload (HOST)
- Edit, cancel, delete own events (HOST)
- Join free or paid events (Stripe)
- Approval-required events with pending/approved/rejected status
- Save/bookmark events

**Participant Management (HOST)**
- View all participants per event
- Approve or reject pending requests
- Expandable panel in dashboard

**Reviews**
- Approved participants can rate and review the host
- Reviews shown on host profile with star ratings and average score

**Saved Events**
- Dedicated `/saved` page
- Remove from saved with one click

**Admin Dashboard**
- Real analytics from `GET /analytics/overview`
- Manage users (ban, role change, delete)
- Manage events (view, delete)
- Host verification workflow

---

## Services Overview

All API calls go through `src/lib/api.ts` (Axios instance with base URL and auth token interceptor).

| Service | Methods |
|---|---|
| `auth.service.ts` | `login`, `register`, `logout`, `getMe`, `forgotPassword`, `resetPassword`, `verifyEmail` |
| `event.service.ts` | `getAllEvents`, `getEventById`, `createEvent`, `updateEvent`, `deleteEvent`, `cancelEvent`, `joinEvent`, `leaveEvent`, `saveEvent`, `unsaveEvent`, `getSavedEvents`, `getEventWaitlist`, `approveParticipant`, `rejectParticipant` |
| `user.service.ts` | `getUserProfile`, `getUserEvents`, `updateProfile`, `updateProfileImage`, `getAllHosts` |
| `review.service.ts` | `createReview`, `getHostReviews` |
| `payment.service.ts` | `createPaymentIntent`, `confirmPayment` |
| `admin.service.ts` | `getAllUsers`, `getAllHosts`, `changeUserRole`, `toggleUserBan`, `deleteUser`, `getAllEvents`, `deleteEvent`, `getAdminStats` |
| `analytics.service.ts` | `getOverview` |

---

## Design System

Dark theme throughout with consistent tokens:

- Background: `bg-slate-900/40` with `backdrop-blur-xl`
- Borders: `border-white/5`
- Cards: `rounded-[2.5rem]`
- Primary color: Emerald green (`text-primary`, `bg-primary`)
- Typography: `font-black`, `uppercase tracking-widest`

---

## Backend

This frontend connects to the [EventMate Server](../eventmate_server/README.md).

Local backend: `http://localhost:5001/api/v1`
Live backend: `https://eventmate-server-3.onrender.com/api/v1`

---

## License

MIT
