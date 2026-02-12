# Kaos EUY! - Project Manual

**Looking for Bandung souvenir T-shirts? EUY!**

A premium custom t-shirt ordering platform featuring Bandung's culture and identity.

---

## 1. Overview

Kaos EUY! is a custom t-shirt brand from Bandung, Indonesia. This platform provides an online ordering system for both personal and bulk orders.

### Key Features

- **Custom Order System**: Personal (1-10 pcs) and bulk (10+ pcs) orders
- **4-Side Design Customization**: Upload images or add text to front, back, left sleeve, right sleeve
- **Product Catalog**: Browse and purchase ready-made products
- **Shopping Cart & Checkout**: Zustand-based state management with guest checkout
- **Payment Gateway**: Duitku integration (ShopeePay, Indomaret, Retail)
- **Admin Panel**: Order management, product CRUD, status updates
- **Order Lookup**: Guests can track orders by ID and email
- **Responsive Design**: Mobile-first approach
- **Multi-language**: Indonesian-based with Sundanese expressions

---

## 2. Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| State Management | Zustand (cart, custom design), React Query (server state) |
| Database & Auth | Supabase (PostgreSQL + Auth + Storage) |
| Payment | Duitku Payment Gateway (Production) |
| Form Validation | React Hook Form + Zod |
| Icons | Lucide React |

---

## 3. Getting Started

### Prerequisites

- Node.js 18+
- Docker Desktop (for local Supabase)
- Supabase CLI (`brew install supabase/tap/supabase`)

### Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start Docker Desktop
open -a Docker

# 3. Start local Supabase
supabase start

# 4. Start dev server
npm run dev
```

### Access URLs

| Service | URL |
|---------|-----|
| Next.js App | http://localhost:3000 |
| Supabase Studio (DB UI) | http://127.0.0.1:54323 |
| Supabase API | http://127.0.0.1:54321 |
| Mailpit (Email testing) | http://127.0.0.1:54324 |

### Admin Login

- URL: http://localhost:3000/admin/login
- Email: `admin@local.test`
- Password: `Admin1234!`

---

## 4. Running with Docker

The app can also run as a Docker container.

### Docker Commands

```bash
# Build and run
docker compose up --build

# Run in background
docker compose up --build -d

# Stop
docker compose down
```

### Docker Architecture

The Dockerfile uses a multi-stage build:

1. **deps**: Install dependencies with `npm ci`
2. **builder**: Build Next.js with `npm run build` (standalone output)
3. **runner**: Copy only the standalone output for a lightweight image

### Docker Environment Notes

- Browser (client-side) uses `localhost:54321` for Supabase
- Server (inside container) uses `host.docker.internal:54321` for Supabase
- These are separated via `build.args` (build-time) vs `environment` (runtime) in `docker-compose.yml`
- Environment variables are loaded from `.env.local` via `env_file`

### One-Command Setup

```bash
./setup.sh
```

This script checks prerequisites, creates `.env.local`, starts Supabase, runs migrations, seeds admin, and builds the Docker container.

---

## 5. Project Structure

```
United_KAOS-EUY/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Home page
│   │   ├── products/                 # Product catalog
│   │   │   ├── page.tsx              # Product listing
│   │   │   └── [slug]/page.tsx       # Product detail + customization
│   │   ├── cart/page.tsx             # Shopping cart
│   │   ├── checkout/
│   │   │   ├── page.tsx              # Checkout form + payment
│   │   │   └── thank-you/page.tsx    # Order confirmation
│   │   ├── order-lookup/page.tsx     # Guest order tracking
│   │   ├── admin/
│   │   │   ├── login/page.tsx        # Admin login
│   │   │   ├── dashboard/page.tsx    # Dashboard
│   │   │   ├── orders/page.tsx       # Order management
│   │   │   └── products/page.tsx     # Product management
│   │   └── api/payment/
│   │       ├── create/route.ts       # Duitku invoice creation
│   │       ├── callback/route.ts     # Payment callback handler
│   │       └── status/route.ts       # Payment status check
│   ├── components/
│   │   ├── common/                   # Button, Input, Modal, Badge, etc.
│   │   ├── layout/                   # Header, Footer
│   │   ├── products/                 # ProductCard, ProductGrid, ColorSelector, etc.
│   │   ├── cart/                     # CartItem, CartIndicator, EmptyCart
│   │   ├── custom/                   # CustomVisualizer, DesignUploader, PositionSelector
│   │   ├── home/                     # HeroSection, CTABanner, ValuePropositions
│   │   ├── admin/                    # AdminSidebar
│   │   └── orders/                   # CustomizationDetails
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── browser.ts            # Client-side Supabase client
│   │   │   ├── server.ts             # Server-side Supabase client
│   │   │   ├── admin.ts              # Service role client (bypasses RLS)
│   │   │   └── database.types.ts     # Auto-generated DB types
│   │   ├── api/                      # API layer (products, auth, adminOrders, etc.)
│   │   ├── hooks/                    # React Query hooks
│   │   ├── query/keys.ts             # Query key constants
│   │   ├── custom/presets.ts          # Design preset templates
│   │   ├── animations.ts             # Framer Motion variants
│   │   └── utils.ts                  # Utility functions (formatIDR, image resize)
│   ├── stores/
│   │   ├── cart.ts                   # Shopping cart store
│   │   ├── customDesign.ts           # Design customization store
│   │   └── admin.ts                  # Admin state store
│   ├── contexts/
│   │   └── LanguageContext.tsx        # Language provider
│   └── types/index.ts                # TypeScript type definitions
├── supabase/
│   ├── migrations/                   # Database migrations (8 files)
│   ├── seed.sql                      # Initial seed data
│   └── config.toml                   # Local Supabase config
├── Dockerfile                        # Multi-stage Docker build
├── docker-compose.yml                # Docker Compose config
├── .dockerignore                     # Docker build exclusions
├── setup.sh                          # One-command setup script
├── middleware.ts                     # Supabase auth session refresh
├── .env.local                        # Environment variables (git-ignored)
└── .env.example                      # Environment variable template
```

---

## 6. Routes

| Route | Description |
|-------|-------------|
| `/` | Home page (Hero, Value Propositions, CTA) |
| `/products` | Product catalog with category filter |
| `/products/[slug]` | Product detail with 4-side customization |
| `/cart` | Shopping cart |
| `/checkout` | Checkout form with payment method selection |
| `/checkout/thank-you` | Order confirmation with payment status |
| `/order-lookup` | Guest order tracking by ID + email |
| `/admin/login` | Admin authentication |
| `/admin/dashboard` | Admin dashboard with stats |
| `/admin/orders` | Order management (view, update status) |
| `/admin/products` | Product CRUD (create, edit, delete) |

---

## 7. Payment Integration (Duitku)

### Supported Payment Methods

| Code | Name | Type |
|------|------|------|
| SP | ShopeePay | E-Wallet |
| I1 | Indomaret | Convenience store |
| FT | Retail | Retail store |

### Payment Flow

```
Customer Checkout → Select payment method → Click "Pay Now"
  → Create order in DB (status: pending, payment_status: unpaid)
  → Create Duitku invoice (MD5 signature + paymentMethod)
  → Redirect to Duitku payment page
  → Customer completes payment
  → Duitku sends POST to /api/payment/callback
  → Verify signature → Update order status (processing, paid)
  → Customer redirected to Thank You page
```

### Payment Configuration

- Merchant Code: `<YOUR_DUITKU_MERCHANT_CODE>` (Production)
- Base URL: `https://passport.duitku.com/webapi/api`
- Environment variables in `.env.local`:
  - `DUITKU_MERCHANT_CODE`
  - `DUITKU_API_KEY`
  - `DUITKU_BASE_URL`
  - `DUITKU_CALLBACK_URL`
  - `DUITKU_RETURN_URL`

### DB Payment Fields (orders table)

| Column | Type | Description |
|--------|------|-------------|
| `payment_reference` | TEXT | Duitku transaction reference ID |
| `payment_method` | TEXT | Payment method used |
| `payment_status` | TEXT | unpaid / paid / expired / failed |
| `paid_at` | TIMESTAMPTZ | Payment completion timestamp |

---

## 8. Useful Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Production build
npm run start                  # Start production server

# Supabase
supabase start                 # Start local Supabase
supabase stop                  # Stop local Supabase
supabase status                # Check Supabase status
supabase db reset              # Reset DB (re-run migrations + seed)
npm run supabase:types         # Regenerate TypeScript types

# Docker
docker compose up --build      # Build and run in Docker
docker compose up --build -d   # Run in background
docker compose down            # Stop Docker container
```

---

## 9. Brand Guide

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#FF6B35` (Sunset Orange) | Energy, vibrancy |
| Secondary | `#2D3436` (Charcoal) | Trust, sophistication |
| Accent | `#00B894` (Mint Green) | Freshness |
| Background | `#FFEAA7` (Warm Cream) | Warmth |

### Typography

- **Display**: Poppins (headlines)
- **Body**: Plus Jakarta Sans (body text)
- **Accent**: Pacifico (logo, Sundanese)

### Brand Tone

- Friendly & Energetic
- Casual with local touch
- Sundanese expressions: "EUY!", "Hatur nuhun", "Wilujeng sumping"

---

## 10. Contact

- **Email**: hello@kaoseuy.com
- **WhatsApp**: +62 812-3456-7890
- **Location**: Bandung, Indonesia
