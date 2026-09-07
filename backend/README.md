# 1Fi Marketplace — Backend

A minimal REST API for the 1Fi Marketplace frontend: products, their variants, and EMI plans.

## Tech stack

- Node.js + Express.js (REST API)
- MongoDB + Mongoose ODM
- Plain JavaScript, no TypeScript, no auth, no payment integration

## Architecture

```
routes -> controllers -> services -> Mongoose -> MongoDB
```

- **routes** — map HTTP method + path to a controller function.
- **controllers** — parse the request, call a service, shape the HTTP response. No business logic.
- **services** — all business logic and Mongoose queries live here.
- **middleware** — CORS, JSON body parsing, 404 handler, global error handler.

```
backend/
  src/
    controllers/
    routes/
    services/
    middleware/
    models/
      Product.js   # Product -> variants[] -> emiPlans[] schema
    app.js         # Express app, middleware, route mounting
    server.js      # connects to MongoDB and starts the HTTP server
    seed.js        # seeds sample products/variants/EMI plans
```

## Data model

Products embed their variants, and each variant embeds its own EMI plans (a natural fit for MongoDB, since a variant's EMI plans are never queried on their own):

```
Product
  name, slug (unique), brand, description, createdAt
  variants: [
    { storage, color, imageUrl, price, mrp,
      emiPlans: [ { tenureMonths, interestRate, monthlyPayment, cashback } ] }
  ]
```

Every subdocument gets its own Mongo `_id`, so `variants[i].id` and `emiPlans[j].id` are stable identifiers used in the API paths below.

## Setup

1. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Create your `.env` from the example:

   ```bash
   cp .env.example .env
   ```

   ```
   MONGODB_URI="mongodb://localhost:27017/1fi_marketplace"
   PORT=4000
   FRONTEND_URL="http://localhost:3000"
   ```

   For a local MongoDB, install MongoDB Community Server (or run `docker run -d -p 27017:27017 mongo`). For a hosted deployment, use a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and paste its connection string into `MONGODB_URI`.

3. Seed the database with 3 products (iPhone 17 Pro, Samsung Galaxy S24 Ultra, OnePlus 13), each with variants and EMI plans:

   ```bash
   npm run seed
   ```

4. Start the API:

   ```bash
   npm run dev     # auto-restarts on file changes
   # or
   npm start
   ```

   The API runs at `http://localhost:4000` by default.

## npm scripts

| Script          | Purpose                               |
|------------------|----------------------------------------|
| `npm run dev`    | Start the server with auto-reload      |
| `npm start`      | Start the server                       |
| `npm run seed`   | Seed the database with sample products |

## API endpoints

### `GET /api/products`
Returns all products (without variants).

```json
[
  { "id": "...", "name": "iPhone 17 Pro", "slug": "iphone-17-pro", "brand": "Apple", "description": "...", "createdAt": "..." }
]
```

### `GET /api/products/:slug`
Returns one product with its variants (each variant includes its EMI plans). `404` if the slug doesn't exist.

```json
{
  "id": "...",
  "name": "iPhone 17 Pro",
  "slug": "iphone-17-pro",
  "brand": "Apple",
  "description": "...",
  "createdAt": "...",
  "variants": [
    {
      "id": "...",
      "storage": "256GB",
      "color": "Silver",
      "imageUrl": "...",
      "price": 99999,
      "mrp": 119999,
      "emiPlans": [
        { "id": "...", "tenureMonths": 12, "interestRate": 10.49, "monthlyPayment": 8333, "cashback": 2000 }
      ]
    }
  ]
}
```

### `GET /api/products/:slug/variants/:variantId/emi-plans`
Returns EMI plans for the given variant. `404` if the product or variant doesn't exist.

```json
[
  { "id": "...", "tenureMonths": 12, "interestRate": 10.49, "monthlyPayment": 8333, "cashback": 2000 }
]
```

### `POST /api/emi-plans/:emiPlanId/select`
Validates that the EMI plan exists and returns a confirmation. No payment is processed.

```json
{
  "confirmed": true,
  "message": "EMI plan selected successfully",
  "emiPlan": { "id": "...", "tenureMonths": 12, "interestRate": 10.49, "monthlyPayment": 8333, "cashback": 2000 },
  "product": { "name": "iPhone 17 Pro", "storage": "256GB", "color": "Silver" }
}
```

`404` if the EMI plan id doesn't exist.

### `GET /health`
Simple liveness check, returns `{ "status": "ok" }`.

## Error handling

- Unknown routes return `404` with `{ "error": "Route not found: ..." }`.
- Missing resources (product/variant/EMI plan) return `404` with a descriptive message.
- Any unexpected error is caught by the global error handler and returns `500` with `{ "error": "Internal server error" }` (details are logged server-side only).

## Connecting the frontend

The frontend fetches from this API via `NEXT_PUBLIC_API_URL` (see the root `.env.local`):

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Set `FRONTEND_URL` in the backend's `.env` to the frontend's origin (e.g. `http://localhost:3000`) so CORS allows the request.
