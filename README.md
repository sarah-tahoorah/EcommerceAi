# Glamora

Glamora is an AI-powered fashion e-commerce project.

## Tech Stack

- Frontend: React + Vite + Tailwind
- Backend: Node.js + Express + MongoDB
- AI service: FastAPI + TensorFlow + OpenCV

## Project Structure

- `client` - frontend
- `server` - backend API
- `ai-service` - AI service
- `render.yaml` - Render deployment config

## Run Locally

1. Install packages:

```bash
npm install
cd ai-service
pip install -r requirements.txt
```

2. Create `server/.env` from `server/.env.example`

3. Start AI service:

```bash
cd ai-service
uvicorn app.main:app --reload --port 8000
```

4. Start frontend + backend:

```bash
npm run dev
```

## Seed Products

If products are not showing, run:

```bash
npm run seed:db
```

## Deploy

### Frontend

Deploy `client` on Vercel.

Set:

- Root Directory: `client`
- Framework: `Vite`
- Environment Variable:

```env
VITE_API_URL=https://your-render-api.onrender.com
```

### Backend + AI

Deploy this repo on Render using `render.yaml`.

Required environment variable:

```env
MONGO_URI=your_mongodb_connection_string
```

## Live Services

- Frontend: Vercel
- Backend health: `/api/health`
- AI health: `/health`

## Notes

- If product images do not show, redeploy Render and Vercel after pushing latest code.
- Render free tier may be slow on the first request after inactivity.
