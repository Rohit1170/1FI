# 1Fi Marketplace

A smartphone marketplace where every product can be bought outright or on an EMI plan backed by mutual funds. Product, pricing, and EMI data is served dynamically from MongoDB via a REST API — nothing is hardcoded in the frontend.

Live example page: `/products/iphone-17-pro`

## Tech stack

| Layer     | Tech                                      |
|-----------|--------------------------------------------|
| Frontend  | Next.js (App Router) + React + Tailwind CSS |
| Backend   | Node.js + Express.js                       |
| Database  | MongoDB + Mongoose                         |

## Project structure

```
1-fi-marketplace/
  app/                      # Next.js frontend
    page.tsx                # Product detail page (also the "/" route)
    products/[slug]/page.tsx
  lib/products.ts           # Frontend API client (fetches from the backend)
  public/                   # Static assets, incl. product images
  backend/                  # Express + MongoDB API
    src/
      models/Product.js     # Mongoose schema: Product -> variants[] -> emiPlans[]
      routes/ controllers/ services/
      seed.js                # Seeds 3 products with variants + EMI plans
      app.js / server.js
    README.md                # Backend-specific details
```

## Data model

A `Product` embeds its `variants`, and each variant embeds its own `emiPlans` (each variant's EMI options are only ever read together with it, so embedding avoids extra joins):

```
Product
  name, slug (unique), brand, description, createdAt
  variants: [
    {
      storage, color, imageUrl, images[] (optional gallery), price (selling price), mrp,
      emiPlans: [ { tenureMonths, interestRate, monthlyPayment, cashback } ]
    }
  ]
```

See [backend/README.md](backend/README.md#data-model) for the full Mongoose schema.

## Setup and run instructions

### Prerequisites

- Node.js 18+
- A MongoDB connection string ([MongoDB Atlas](https://www.mongodb.com/atlas) free tier works well, or a local `mongod`)

### 1. Backend (API + database)

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/1fi_marketplace?retryWrites=true&w=majority"
PORT=4000
FRONTEND_URL="http://localhost:3000"
```

Seed the database with 3 products (iPhone 17 Pro, Samsung Galaxy S24 Ultra, OnePlus 13), each with 3 variants and 3 EMI plans:

```bash
npm run seed
```

Start the API:

```bash
npm run dev
```

The API runs at `http://localhost:4000`.

### 2. Frontend

From the repo root:

```bash
npm install
```

Create `.env.local` in the repo root:

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000` (or e.g. `http://localhost:3000/products/samsung-s24-ultra`).

## API endpoints

Full request/response reference: [backend/README.md](backend/README.md#api-endpoints). Summary:

| Method | Endpoint                                              | Description                              |
|--------|--------------------------------------------------------|-------------------------------------------|
| GET    | `/api/products`                                         | List all products (no variants)           |
| GET    | `/api/products/:slug`                                   | One product with its variants + EMI plans |
| GET    | `/api/products/:slug/variants/:variantId/emi-plans`     | EMI plans for one variant                 |
| POST   | `/api/emi-plans/:emiPlanId/select`                      | Confirm an EMI plan selection              |
| GET    | `/health`                                               | Liveness check                            |

Example — `GET /api/products/iphone-17-pro`:

```json
{
  "id": "6a9e82be976b5e50fc889e78",
  "name": "iPhone 17 Pro",
  "slug": "iphone-17-pro",
  "brand": "Apple",
  "description": "The latest flagship smartphone with advanced AI capabilities, stunning display, and exceptional camera system.",
  "variants": [
    {
      "id": "6a9e82be976b5e50fc889e79",
      "storage": "256GB",
      "color": "Silver",
      "imageUrl": "/images/products/iphone-17-pro/screen.webp",
      "images": [
        "/images/products/iphone-17-pro/screen.webp",
        "/images/products/iphone-17-pro/front-back.webp",
        "/images/products/iphone-17-pro/camera.webp"
      ],
      "price": 99999,
      "mrp": 119999,
      "emiPlans": [
        { "id": "6a9e82be976b5e50fc889e7a", "tenureMonths": 12, "interestRate": 10.49, "monthlyPayment": 8833, "cashback": 2000 },
        { "id": "6a9e82be976b5e50fc889e7b", "tenureMonths": 18, "interestRate": 11.99, "monthlyPayment": 6055, "cashback": 1500 },
        { "id": "6a9e82be976b5e50fc889e7c", "tenureMonths": 24, "interestRate": 13.49, "monthlyPayment": 4708, "cashback": 1000 }
      ]
    }
  ]
}
```

## Deployment

- **Frontend** — deploy to Vercel with the root directory set to the repo root and `NEXT_PUBLIC_API_URL` set to the deployed backend's URL (e.g. `https://your-api.onrender.com/api`).
- **Backend** — deploy `backend/` to Render/Railway with `MONGODB_URI`, `PORT`, and `FRONTEND_URL` (set to the deployed frontend's URL, for CORS) as environment variables.
- **Database** — MongoDB Atlas free tier; run `npm run seed` once against the production `MONGODB_URI` to populate it.
