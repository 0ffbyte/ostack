# 🧱 OStack – All-in-One SaaS Starter Kit

**OStack** is Artntek’s internal foundation for building SaaS products — a modern, type-safe, production-ready stack optimized for fast iteration, scalability, and clean architecture.

---

### 🧩 Tech Stack

- **Framework:** Next.js 16
- **State Management:** Zustand
- **Database & ORM:** Postgres + Drizzle ORM
- **Authentication:** Better Auth
- **Styling:** Tailwind CSS
- **Object Storage:** Cloudflare R2
- **Queue & Scheduling:** Upstash QStash (Messages + Cron Schedules)
- **Payments:** Stripe (Subscriptions + Usage-based Billing)
- **Client Data Fetching:** SWR

---

### ⚙️ Core Features

- 🔐 User authentication & session management
- 📦 File uploads & Cloudflare R2 integration
- 📬 Serverless-ready background jobs & scheduled tasks via QStash
- 💳 Subscription management with Stripe
- 📊 Built-in usage tracking & reporting for metered billing
- 🗄️ Pre-configured database schema with migrations
- 🧠 Type-safe full-stack setup using modern TypeScript patterns
- ⚡ Efficient client-side caching & revalidation with SWR

---

### ⚙️ Environment Variables

Create a `.env.local` file at the project root and configure the following variables:

```bash
# Environment
NODE_ENV="development"

# Database
DATABASE_URL=

# Authentication
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

# OAuth Providers
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Cloudflare R2 Storage
R2_ENDPOINT=
R2_ACCESS_KEY=
R2_SECRET_KEY=

# Upstash QStash
QSTASH_TOKEN=
QSTASH_CURRENT_SIGNING_KEY=
QSTASH_NEXT_SIGNING_KEY=
```

---

### 🚀 Getting Started

Initialize a new project with **Bun**:

```bash
bun init
```

Then follow your setup steps (install dependencies, configure environment variables, run database migrations, etc.).

---

### 📚 Testing Locally

Forwarding stripe events:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Run a local QStash server:

```bash
npx @upstash/qstash-cli dev
```

### 🧠 Philosophy

OStack is designed to eliminate boilerplate and unify conventions across Artntek’s ecosystem — making it effortless to launch, maintain, and evolve SaaS products with a consistent developer experience.

### 📚 New Concepts

- **Scheduled Subscriptions:** More on this later.
