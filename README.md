# Glamora

AI-powered premium fashion ecommerce platform inspired by Myntra, Flipkart, and Zara.

## Stack

- Frontend: React + Tailwind + Framer Motion
- Backend: Node.js + Express + MongoDB
- AI Service: Python + FastAPI + TensorFlow + OpenCV

## Included Features

- Elegant fashion UI (black/white/gold with luxury card design)
- Home, Category, Product, Image Search, Cart, Profile, Admin pages
- Voice search in navbar
- Dark mode toggle
- Wishlist and ratings
- Smart outfit recommendation API
- AI fashion chatbot API
- Image-based similarity search API
- ZIP dataset ingestion and auto catalog creation

## Project Structure

- `client/` React app
- `server/` Express API + Mongo models
- `ai-service/` Python AI inference service
- `dataset/raw/` extracted category folders
- `dataset/processed/catalog.json` generated products
- `scripts/build-catalog.js` dataset to catalog pipeline

## 1) Generate Catalog From ZIP Dataset

ZIP files were extracted into `dataset/raw/*`.

To rebuild catalog and product assets:

```bash
node scripts/build-catalog.js
```

This writes:
- `dataset/processed/catalog.json`
- product images under `server/public/products/*`

## 2) Install Dependencies

From root:

```bash
npm install
npm install -w server
npm install -w client
```

For AI service:

```bash
cd ai-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## 3) Configure Environment

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/glamora
JWT_SECRET=change_me
AI_SERVICE_URL=http://127.0.0.1:8000
```

## 4) Seed MongoDB

```bash
npm run seed:db
```

## 5) Start Services

Terminal 1 (AI):

```bash
cd ai-service
uvicorn app.main:app --reload --port 8000
```

Terminal 2 (API + Frontend):

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:5000`
- AI: `http://localhost:8000`

## Deployment

### Frontend on Vercel

- Import the repository into Vercel
- Set the root directory to `client`
- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Add environment variable:

```env
VITE_API_URL=https://your-render-backend.onrender.com
```

### Backend on Render

- Create a new Node Web Service from this repository
- Set the root directory to `server`
- Build command:

```bash
npm install
```

- Start command:

```bash
npm start
```

- Add environment variables:

```env
PORT=10000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
AI_SERVICE_URL=https://your-ai-service-url
```

After deployment:

- Frontend URL will be your Vercel deployment link
- Backend URL will be your Render deployment link

## Demo Flows

1. Home page banners, trending, new arrivals, AI assistant
2. Category page filtering by price/color/sort
3. Product page with size selector and smart outfit recommendations
4. Image search page upload -> type/color/pattern + similar products
5. Cart checkout and order creation
6. Profile login/signup + order history
7. Admin page analytics + ZIP category upload
