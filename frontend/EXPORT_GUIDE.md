# Frontend Export Guide for Java/Spring Boot Integration

## Project Overview
This is a **Savadhika Thai Massage Booking System** built with React + TypeScript + Tailwind CSS.

## 📦 How to Export

### Option 1: Download from Figma Make (Recommended)
1. In Figma Make, click the **three-dot menu** (⋯) at the top right
2. Select **"Download code"** or **"Export project"**
3. This will download a ZIP file with all your frontend code

### Option 2: Manual Copy
Copy the entire `/workspaces/default/code` directory to your local machine.

---

## 📂 Project Structure

```
savadhika-frontend/
├── src/
│   ├── app/
│   │   ├── pages/              # All page components
│   │   │   ├── HomeMain.tsx    # Landing page
│   │   │   ├── CitySelection.tsx
│   │   │   ├── BodyAreaSelection.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Booking.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── Payment.tsx
│   │   │   ├── PaymentGateway.tsx
│   │   │   ├── Confirmation.tsx
│   │   │   ├── Journey.tsx
│   │   │   ├── Info.tsx
│   │   │   ├── Auth.tsx
│   │   │   ├── AdminPanel.tsx
│   │   │   └── AdminDashboard.tsx
│   │   │
│   │   ├── components/         # Reusable components
│   │   │   ├── AuthModal.tsx
│   │   │   ├── BackgroundMusic.tsx
│   │   │   ├── DiscountScroller.tsx
│   │   │   ├── LanguageSelector.tsx
│   │   │   ├── LotusButton.tsx
│   │   │   ├── admin/
│   │   │   │   ├── MISReport.tsx
│   │   │   │   └── TherapyMassageMaster.tsx
│   │   │   └── ui/             # Radix UI components
│   │   │
│   │   ├── contexts/           # React Context providers
│   │   │   ├── AuthContext.tsx
│   │   │   ├── BookingContext.tsx
│   │   │   └── LanguageContext.tsx
│   │   │
│   │   ├── App.tsx             # Root component
│   │   └── routes.tsx          # React Router configuration
│   │
│   └── styles/                 # CSS files
│       ├── index.css
│       ├── tailwind.css
│       ├── fonts.css
│       └── theme.css
│
├── package.json                # Dependencies
└── vite.config.js             # Vite configuration
```

---

## 🔧 Setup Instructions for Local Development

### 1. Prerequisites
- Node.js 18+ and npm/pnpm installed
- Java 17+ and Maven/Gradle (for Spring Boot backend)

### 2. Install Dependencies
```bash
cd savadhika-frontend
pnpm install
# or
npm install
```

### 3. Create `.env` file
Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 4. Run Development Server
```bash
pnpm dev
# or
npm run dev
```

The app will run on `http://localhost:5173`

---

## 🔌 API Integration Points

### Files to Update for Java/Spring Boot Backend

You need to update these files to connect to your Java backend:

#### 1. **AuthContext.tsx** (`src/app/contexts/AuthContext.tsx`)
Current Supabase endpoints:
```typescript
// Change these URLs to your Spring Boot endpoints
POST /auth/signup → http://localhost:8080/api/auth/signup
POST /auth/signin → http://localhost:8080/api/auth/signin
```

#### 2. **Services.tsx** (`src/app/pages/Services.tsx`)
```typescript
GET /massages → http://localhost:8080/api/massages
POST /cart/add → http://localhost:8080/api/cart/add
```

#### 3. **Checkout.tsx** (`src/app/pages/Checkout.tsx`)
```typescript
GET /cart/items → http://localhost:8080/api/cart/items
DELETE /cart/remove/:id → http://localhost:8080/api/cart/remove/{id}
```

#### 4. **Payment.tsx** (`src/app/pages/Payment.tsx`)
```typescript
POST /payment/create-order → http://localhost:8080/api/payment/create-order
POST /payment/verify → http://localhost:8080/api/payment/verify
POST /transaction/create → http://localhost:8080/api/transaction/create
POST /payment/store-info → http://localhost:8080/api/payment/store-info
DELETE /cart/clear → http://localhost:8080/api/cart/clear
```

#### 5. **AdminPanel.tsx** (`src/app/pages/AdminPanel.tsx`)
```typescript
POST /admin/massages → http://localhost:8080/api/admin/massages
PUT /admin/massages/:id → http://localhost:8080/api/admin/massages/{id}
DELETE /admin/massages/:id → http://localhost:8080/api/admin/massages/{id}
GET /admin/bookings → http://localhost:8080/api/admin/bookings
```

#### 6. **MISReport.tsx** (`src/app/components/admin/MISReport.tsx`)
```typescript
POST /mis-report → http://localhost:8080/api/mis-report
```

---

## 🌐 API Endpoints Your Spring Boot Backend Should Implement

### Authentication APIs
```
POST /api/auth/signup
POST /api/auth/signin
GET  /api/auth/me
```

### Massage APIs
```
GET  /api/massages
POST /api/massages/initialize
```

### Cart APIs
```
POST   /api/cart/add
GET    /api/cart/items
DELETE /api/cart/remove/{id}
DELETE /api/cart/clear
```

### Payment APIs
```
POST /api/payment/create-order
POST /api/payment/verify
POST /api/payment/store-info
```

### Transaction APIs
```
POST /api/transaction/create
```

### Admin APIs
```
POST   /api/admin/massages
PUT    /api/admin/massages/{id}
DELETE /api/admin/massages/{id}
GET    /api/admin/bookings
```

### Reports
```
POST /api/mis-report
```

---

## 🗄️ Database Schema

Your Spring Boot backend should implement these tables:

### 1. **customer_master**
```sql
id            INT (Primary Key, Auto Increment)
customername  VARCHAR(255)
email         VARCHAR(255) UNIQUE
mobile_no     VARCHAR(20)
city          VARCHAR(100)
password      VARCHAR(255)
confirmpassword VARCHAR(255)
created_at    TIMESTAMP
```

### 2. **massage_master**
```sql
id            INT (Primary Key, Auto Increment)
massagename   VARCHAR(255)
massagetype   VARCHAR(100)  -- 'Lower Body', 'Torso', 'Upper Body'
duration      INT           -- in minutes
price         DECIMAL(10,2)
massagezone   VARCHAR(100)  -- 'Mumbai', 'Delhi'
Description   TEXT
created_at    TIMESTAMP
```

### 3. **cart_master**
```sql
id              INT (Primary Key, Auto Increment)
customerid      INT (Foreign Key → customer_master.id)
massageid       INT (Foreign Key → massage_master.id)
quantity        INT
amount          DECIMAL(10,2)
transactiondate TIMESTAMP
created_at      TIMESTAMP
```

### 4. **cust_mass_trans**
```sql
trans_id      INT (Primary Key, Auto Increment)
custid        INT (Foreign Key → customer_master.id)
massid        INT (Foreign Key → massage_master.id)
datetrans     TIMESTAMP
coupon_code   VARCHAR(50)
amount        DECIMAL(10,2)
created_at    TIMESTAMP
```

### 5. **customer_payments**
```sql
id             INT (Primary Key, Auto Increment)
customerid     INT (Foreign Key → customer_master.id)
paymentdetails TEXT
created_at     TIMESTAMP
```

---

## 🔐 Authentication Flow

1. User signs up → Backend creates user in `customer_master` table
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. Frontend includes token in `Authorization: Bearer {token}` header for protected routes

---

## 📸 Images/Assets

The project uses images imported with `figma:asset/...`. You'll need to:

1. Export these images from Figma Make (they'll be in an `assets` folder)
2. Place them in `/public/images/` directory
3. Update all import statements from:
   ```typescript
   import logoIcon from 'figma:asset/f5c3621...png';
   ```
   To:
   ```typescript
   import logoIcon from '/images/logo-icon.png';
   ```

**List of images used:**
- Logo icon (lotus)
- Buddha image
- Pink gradient background
- Pink lily flowers
- Bougainvillea flowers
- Cherry blossom flowers
- Mumbai city image
- Delhi city image
- Blue lotus logo

---

## 🎨 Styling

- **Framework:** Tailwind CSS v4
- **UI Components:** Radix UI + shadcn/ui
- **Animations:** Motion (Framer Motion)
- **Fonts:** 
  - Averia Serif Libre
  - Pacifico

---

## 📝 Key Dependencies

```json
{
  "react": "18.3.1",
  "react-router": "7.13.0",
  "motion": "12.23.24",
  "tailwindcss": "4.1.12",
  "lucide-react": "0.487.0",
  "sonner": "2.0.3",
  "@mui/material": "7.3.5"
}
```

---

## 🚀 Next Steps

1. **Export the frontend code** from Figma Make
2. **Set up a new Spring Boot project** with Maven/Gradle
3. **Create the database schema** in MySQL/PostgreSQL
4. **Implement REST API endpoints** in Spring Boot
5. **Update API base URL** in frontend code
6. **Test the integration** between React and Spring Boot
7. **Deploy** frontend (Vercel/Netlify) and backend (Heroku/Railway)

---

## 🔗 API Integration Example

Here's how to update the API calls in your frontend:

### Before (Supabase):
```typescript
const response = await fetch(
  `https://huihouqwgdtoxqnyvitz.supabase.co/functions/v1/make-server-86f09702/massages`,
  {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`
    }
  }
);
```

### After (Spring Boot):
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const response = await fetch(
  `${API_BASE_URL}/massages`,
  {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }
);
```

---

## ✅ Checklist for Migration

- [ ] Export frontend code from Figma Make
- [ ] Install dependencies locally
- [ ] Export and organize images
- [ ] Create Spring Boot project
- [ ] Set up database with schema
- [ ] Implement authentication (JWT)
- [ ] Implement all API endpoints
- [ ] Update API URLs in frontend
- [ ] Test authentication flow
- [ ] Test booking flow
- [ ] Test admin panel
- [ ] Test payment integration
- [ ] Deploy both frontend and backend

---

## 📞 Support

If you need help with any step, refer to:
- Spring Boot Documentation: https://spring.io/projects/spring-boot
- React Router: https://reactrouter.com/
- Tailwind CSS: https://tailwindcss.com/

Good luck with your project! 🎉
