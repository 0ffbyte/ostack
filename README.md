# 🧱 OStack – All-in-One SaaS Starter Kit

**OStack** is Artntek’s internal foundation for building SaaS products — a modern, type-safe, production-ready stack optimized for **fast iteration**, **scalability**, and **clean architecture**.

OStack eliminates boilerplate and unifies conventions across Artntek’s ecosystem, making it effortless to **launch, maintain, and evolve** SaaS products with a consistent developer experience.

### 🧩 Tech Stack

- **Framework:** Next.js 16
- **Authentication:** Better Auth
- **Database & ORM:** Neon Postgres + Drizzle ORM
- **Payments:** Stripe (Subscriptions + Usage-based Billing)
- **Queue & Cron:** Upstash QStash (Messages + Cron Schedules)
- **Object Storage:** Cloudflare R2
- **Client Data Fetching:** SWR
- **State Management:** Zustand
- **UI & Styling:** Tailwind CSS + Shadcn UI

### ⚙️ OStack Core

- 🔐 Authentication & Authorization
- 💳 Subscription Management
- 📊 Metered Billing & Usage Tracking
- 📦 File Uploads & Sotrage
- 📬 Queues & Scheduled Jobs
- 🗄️ Postgres DB

### 🚀 Getting Started

**Initialize the project:**

```bash
bun init
```

Then follow your setup steps:

1. Configure environment variables
2. Run database migrations
3. Start your development server

**Configure environment variables:**

Create a `.env` file at the project root and configure the following:

```bash
# Environment
NODE_ENV="development"

# Database
DATABASE_URL=

# Authentication
BETTER_AUTH_SECRET=strong-secret-123
BETTER_AUTH_URL=https://localhost:3000 # dev server url

# OAuth Providers
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# QStash
QSTASH_URL=http://127.0.0.1:8080 # dev server url
QSTASH_TOKEN=
QSTASH_CURRENT_SIGNING_KEY=
QSTASH_NEXT_SIGNING_KEY=

# Cloudflare R2
R2_ENDPOINT=
R2_ACCESS_KEY=
R2_SECRET_KEY=
```

**Run database migrations:**

```bash
bun db:generate
bun db:migrate
```

**Start the development server:**

```bash
bun dev
```

### 📚 Testing Locally

Forward stripe events using the cli:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Run a local QStash server:

```bash
npx @upstash/qstash-cli dev
```

### 📁 File Structure

To migrate any existing projects, you can simply copy/swap the following files and folders. It's plug and play by design.

```bash
.
├── app
│   └── (auth)
├── core
│   ├── auth
│   ├── db
│   ├── integration
│   ├── payment
│   └── types.ts
├── drizzle.config.ts
├── ostack.config.ts
├── proxy.ts
```

### 🧠 Philosophy

OStack isn’t just a starter kit — it’s a **living foundation** for Artntek’s SaaS ecosystem.
It’s built on the belief that great software comes from **clarity, taste, and consistency**, not endless setup.
With OStack, teams can focus on what truly matters: **creating products with intention and velocity**.
