# Savadhika Thai Massage Booking System - Export Package

## 📖 What's Inside

This export package contains the complete **React + TypeScript frontend** for the Savadhika Thai Massage Booking System.

---

## 📚 Documentation Files

This package includes comprehensive documentation to help you set up the project with Java/Spring Boot:

1. **EXPORT_GUIDE.md** - Complete guide to export and set up the frontend locally
2. **API_SPECIFICATIONS.md** - Detailed REST API documentation with request/response formats
3. **SPRING_BOOT_SETUP.md** - Step-by-step guide to create the Spring Boot backend
4. **README_EXPORT.md** - This file

---

## 🚀 Quick Start

### Step 1: Export the Code

**From Figma Make:**
1. Click the three-dot menu (⋯) at top right
2. Select "Download code" or "Export project"
3. Extract the ZIP file to your local machine

### Step 2: Install Dependencies

```bash
cd savadhika-frontend
npm install
# or
pnpm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Step 4: Run Development Server

```bash
npm run dev
# or
pnpm dev
```

Visit: http://localhost:5173

---

## 🔧 Backend Setup

### Prerequisites
- Java 17+
- MySQL or PostgreSQL
- Maven

### Follow These Guides in Order:

1. **Read SPRING_BOOT_SETUP.md** first
   - Create Spring Boot project
   - Set up database
   - Configure dependencies

2. **Read API_SPECIFICATIONS.md**
   - Understand all API endpoints
   - See request/response formats
   - Implement REST controllers

3. **Connect Frontend to Backend**
   - Update `src/app/config/api.ts` with your backend URL
   - Test authentication flow
   - Test booking flow

---

## 📂 Project Features

### User Features
- ✅ Multi-language support (English/Hindi)
- ✅ City selection (Mumbai/Delhi)
- ✅ Body area selection (Lower Body/Torso/Upper Body)
- ✅ Browse massage services
- ✅ Add to cart
- ✅ Checkout with payment gateway
- ✅ User authentication (Sign Up/Sign In)
- ✅ Background music player
- ✅ Responsive design

### Admin Features
- ✅ Admin login
- ✅ Add/Edit/Delete massage services
- ✅ View all bookings
- ✅ MIS reports (date range filtering)

---

## 🗂️ Key Files to Update

When connecting to Spring Boot backend, update these files:

### 1. API Configuration (`src/app/config/api.ts`)
```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

### 2. Remove Supabase-specific Code
- Remove `src/app/components/DatabaseInitializer.tsx` (or update it)
- Remove imports from `/utils/supabase/info`

### 3. Update Authentication Context
- File: `src/app/contexts/AuthContext.tsx`
- Change API calls to use Spring Boot endpoints

---

## 🌐 API Endpoints Your Backend Must Implement

### Authentication
- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `GET /api/auth/me`

### Massages
- `GET /api/massages`
- `POST /api/massages/initialize`

### Cart
- `POST /api/cart/add`
- `GET /api/cart/items`
- `DELETE /api/cart/remove/{id}`
- `DELETE /api/cart/clear`

### Payment
- `POST /api/payment/create-order`
- `POST /api/payment/verify`
- `POST /api/payment/store-info`

### Transactions
- `POST /api/transaction/create`

### Admin
- `POST /api/admin/massages`
- `PUT /api/admin/massages/{id}`
- `DELETE /api/admin/massages/{id}`
- `GET /api/admin/bookings`

### Reports
- `POST /api/mis-report`

**Full API documentation in `API_SPECIFICATIONS.md`**

---

## 🗄️ Database Schema

Your Spring Boot backend needs these tables:

1. **customer_master** - User accounts
2. **massage_master** - Massage services
3. **cart_master** - Shopping cart
4. **cust_mass_trans** - Booking transactions
5. **customer_payments** - Payment information

**Complete SQL schema in `SPRING_BOOT_SETUP.md`**

---

## 📦 Dependencies Used

### Frontend (React)
- React 18.3.1
- React Router 7.13.0
- Tailwind CSS 4.1.12
- Motion (Framer Motion) 12.23.24
- Lucide React (icons)
- Material-UI
- Sonner (toast notifications)

### Backend (Spring Boot)
- Spring Boot 3.2.x
- Spring Data JPA
- Spring Security
- JWT (JSON Web Tokens)
- MySQL/PostgreSQL Driver
- Lombok

---

## 🎨 Design Assets

### Images to Export
The project uses several images that need to be exported:

1. **Logo & Branding**
   - Lotus logo icon
   - Blue lotus logo
   - Buddha image

2. **Decorative Elements**
   - Pink gradient background
   - Pink lily flowers
   - Bougainvillea flowers
   - Cherry blossom flowers

3. **City Images**
   - Mumbai skyline
   - Delhi landmarks

**After export:** Place images in `public/images/` and update import paths in components.

---

## 🔐 Admin Credentials

**Username:** admin  
**Password:** admin

*(Hardcoded for demo - implement proper admin authentication in production)*

---

## 🚨 Important Notes

### Current Setup
- The current backend uses **Supabase Edge Functions** (TypeScript/Deno)
- REST APIs are already implemented
- Database is PostgreSQL on Supabase

### For Java/Spring Boot Migration
- You need to **reimplement all backend logic** in Spring Boot
- Frontend code stays the same (React)
- Only API endpoints need to be updated
- Database schema remains the same

### Security Considerations
- Enable CORS in Spring Boot
- Implement JWT authentication properly
- Use HTTPS in production
- Sanitize user inputs
- Hash passwords with BCrypt

---

## 📞 Troubleshooting

### Frontend not connecting to backend?
1. Check CORS configuration in Spring Boot
2. Verify backend is running on port 8080
3. Check `.env` file has correct API URL
4. Check browser console for errors

### Authentication not working?
1. Check JWT secret is set in `application.properties`
2. Verify token is being sent in Authorization header
3. Check Spring Security configuration

### Database errors?
1. Verify database connection in `application.properties`
2. Check if tables are created
3. Ensure foreign key constraints are correct

---

## 🎓 For Your Teacher

This project demonstrates:

✅ **Frontend:**
- Modern React with TypeScript
- Component-based architecture
- State management with Context API
- Client-side routing
- Responsive design with Tailwind CSS

✅ **Backend (to be implemented in Spring Boot):**
- RESTful API design
- MVC architecture
- Database modeling with JPA/Hibernate
- JWT authentication
- CRUD operations
- Transaction management

✅ **Database:**
- Relational database design
- Foreign key relationships
- Normalized schema
- SQL queries

---

## 📈 Development Roadmap

### Phase 1: Backend Setup (Week 1)
- [ ] Create Spring Boot project
- [ ] Set up database
- [ ] Implement entity classes
- [ ] Create repositories

### Phase 2: API Implementation (Week 2)
- [ ] Implement authentication APIs
- [ ] Implement massage APIs
- [ ] Implement cart APIs
- [ ] Implement payment APIs

### Phase 3: Integration (Week 3)
- [ ] Connect frontend to backend
- [ ] Test all features
- [ ] Fix bugs
- [ ] Add error handling

### Phase 4: Deployment (Week 4)
- [ ] Deploy backend (Heroku/Railway)
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Set up production database
- [ ] Final testing

---

## 📚 Additional Resources

- **Spring Boot Tutorial:** https://spring.io/guides/gs/spring-boot/
- **React Documentation:** https://react.dev/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **JWT Guide:** https://jwt.io/introduction
- **MySQL Tutorial:** https://www.mysqltutorial.org/

---

## ✅ Submission Checklist

When submitting to your teacher:

- [ ] Complete frontend code (React)
- [ ] Complete backend code (Spring Boot)
- [ ] Database schema SQL file
- [ ] API documentation
- [ ] README with setup instructions
- [ ] Screenshots/demo video
- [ ] Project report (if required)

---

## 🎯 Success Criteria

Your project will demonstrate:

1. ✅ Full-stack web development (React + Spring Boot)
2. ✅ RESTful API design and implementation
3. ✅ Database design and management
4. ✅ Authentication and authorization
5. ✅ CRUD operations
6. ✅ Payment gateway integration
7. ✅ Admin panel functionality
8. ✅ Responsive UI/UX

---

## 💡 Tips for Success

1. **Start with authentication** - Get login/signup working first
2. **Test each endpoint** - Use Postman before connecting frontend
3. **One feature at a time** - Don't try to implement everything at once
4. **Keep code organized** - Follow MVC pattern strictly
5. **Write comments** - Document your code for better understanding
6. **Ask for help** - Don't hesitate to ask your teacher or classmates

---

## 🎉 You're Ready!

You now have everything you need to convert this Figma Make project into a full-fledged Java/Spring Boot application.

**Start with:** `SPRING_BOOT_SETUP.md`

Good luck with your project! 🚀

---

*Created with Figma Make | Enhanced for Java/Spring Boot Integration*
