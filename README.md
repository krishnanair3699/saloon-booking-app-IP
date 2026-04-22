# 🌸 Saloon & Spa Booking Portal

Full-stack web application with React frontend + Java Spring Boot backend + Supabase database.

```
saloon-booking-app/
├── frontend/        ← React + Vite + TypeScript (your Figma export)
├── backend/         ← Java Spring Boot REST API
├── .gitignore       ← keeps secrets off GitHub
└── README.md        ← this file
```

---

## ⚙️ How Everything Connects

```
[ React Frontend ]  →  REST API calls  →  [ Spring Boot Backend ]  →  [ Supabase DB ]
  localhost:5173                            localhost:8080               PostgreSQL
```

---

## 🚀 Running Locally

### 1. Start the Backend
```bash
cd backend
# Add your Supabase credentials to application.properties first!
mvn spring-boot:run
# Runs on http://localhost:8080
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 🔑 Backend Setup (Important!)

Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://db.YOUR_PROJECT_REF.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=YOUR_SUPABASE_PASSWORD
```
Get these from: **Supabase Dashboard → Settings → Database → Connection String**

---

## 🌐 Deploying

| Part | Platform | Cost |
|------|----------|------|
| Frontend | GitHub Pages or Vercel | Free |
| Backend | Render.com | Free |
| Database | Supabase | Free |

After deploying backend on Render, update `frontend/.env.local`:
```
VITE_API_BASE_URL=https://your-app.onrender.com/api
```

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/signin` | Login, returns JWT |
| GET | `/api/massages` | All services |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/slots?date=` | Available slots |
| POST | `/api/payment/create-order` | Start payment |
| GET | `/api/mis-report` | Admin report |
