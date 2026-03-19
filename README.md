# EventMate — Client

> Discover and host unforgettable local events. Connect with people who share your passions.

**Live App:** [https://eventmate-client.onrender.com](https://eventmate-client.onrender.com)  
**Backend API:** [https://eventmate-rwy8.onrender.com/api/v1](https://eventmate-rwy8.onrender.com/api/v1)

---

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
| Real-time | Socket.io Client |
| Notifications | Sonner (toast) |
| Icons | Lucide React |
| Fonts | Outfit (Google Fonts) |

---

## Features

**Auth**
- JWT login with access + refresh tokens
- Email verification on register
- Forgot / reset password flow
- Persistent auth state via Zustand

**Events**
- Browse with search, category, location, date range, paid-only filters
- Create events with image upload via ImageKit (HOST)
- Edit, cancel, delete own events (HOST)
- Join free or paid events (Stripe payment flow)
- Approval-required events — pending / approved / rejected status
- Save / bookmark events

**Payments**
- Stripe Elements integration
- Payment intent created server-side
- Confirmed server-side after Stripe success

**Participants (HOST)**
- View all participants per event
- Approve or reject pending join requests

**Reviews**
- Approved participants can rate and review the host
- Star ratings with average score on host profile
- Real reviews shown on homepage

**Notifications**
- Real-time via Socket.io
- Bell icon with unread count badge
- Notification dropdown in navbar

**Admin Dashboard**
- Real analytics (users, hosts, events, revenue)
- Manage users — ban, role change, delete
- Host verification workflow
- Event moderation

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

### 3. Run

```bash
npm run dev       # Development (Turbopack)
npm run build     # Production build
npm start         # Start production server
```

App runs on `http://localhost:3000`

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Home
│   ├── layout.tsx                # Root layout + metadata
│   ├── login/                    # Login
│   ├── register/                 # Register (USER or HOST)
│   ├── forgot-password/
│   ├── reset-password/
│   ├── verify-email/
│   ├── verify-email-sent/
│   ├── dashboard/                # Role-based dashboard
│   ├── events/
│   │   ├── page.tsx              # Browse events + filters
│   │   ├── create/               # Create event (HOST)
│   │   └── [id]/
│   │       ├── page.tsx          # Event detail + join/pay/review
│   │       └── edit/             # Edit event (HOST)
│   ├── profile/[id]/             # User profile + reviews
│   ├── saved/                    # Bookmarked events
│   ├── hosts/                    # Browse all hosts
│   └── admin/                    # Admin panel
├── components/
│   ├── Navbar.tsx
│   ├── PaymentForm.tsx
│   └── providers/
├── services/                     # API layer (Axios)
├── store/
│   └── auth.store.ts             # Zustand auth
├── hooks/
│   └── useNotifications.ts       # Socket.io notifications
└── lib/
    ├── api.ts                    # Axios instance
    └── socket.ts                 # Socket.io singleton
```

---

## Pages

| Route | Access | Description |
|---|---|---|
| `/` | Public | Home — events, hosts, reviews, CTA |
| `/events` | Public | Browse + filter events |
| `/events/:id` | Public | Event detail, join, pay, review |
| `/hosts` | Public | All verified hosts |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/dashboard` | Auth | Role-based dashboard |
| `/profile/:id` | Auth | Profile + edit |
| `/saved` | Auth | Saved events |
| `/events/create` | HOST | Create event |
| `/events/:id/edit` | HOST | Edit event |
| `/admin` | ADMIN | Admin dashboard |

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

---

## Deployment

Deployed on **Render** as a Node.js Web Service.

- Build: `npm install && npm run build`
- Start: `npm start`

---

## Related

- [EventMate Server](../eventmate_server/README.md) — Backend REST API

---

## License

MIT
