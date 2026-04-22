# ⚡ Quick Start Guide

## Get Your Java Backend Running in 5 Minutes!

---

## 🎯 Before You Start

Make sure you have:
- ✅ Java 17+ installed (`java -version`)
- ✅ Maven installed (`mvn -version`)
- ✅ Supabase database credentials
- ✅ Supabase tables already created

---

## 🚀 Step 1: Configure Database (2 minutes)

1. Open `/java-backend/src/main/resources/application.properties`

2. Update these 2 lines:

```properties
# Line 8: Update with YOUR Supabase host
spring.datasource.url=jdbc:postgresql://db.YOUR_PROJECT_ID.supabase.co:5432/postgres

# Line 11: Update with YOUR Supabase password
spring.datasource.password=YOUR_ACTUAL_PASSWORD
```

**How to find your Supabase credentials:**
- Go to: https://supabase.com/dashboard
- Click your project
- Settings → Database
- Copy "Host" and "Password"

---

## 🚀 Step 2: Build & Run (3 minutes)

Open terminal in `/java-backend` folder:

```bash
# Build the project (first time only)
mvn clean install

# Start the server
mvn spring-boot:run
```

**Wait for this message:**
```
================================
SAVADHIKA Spa Booking Backend
Server running on: http://localhost:8080/api
================================
```

🎉 **Your backend is now running!**

---

## 🧪 Step 3: Quick Test

Open a new terminal and run:

```bash
# Test if server is responding
curl http://localhost:8080/api/massages
```

**Expected**: `[]` (empty array - normal if no massages in database yet)

**Create a test account:**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "test123"
  }'
```

**Expected**: Returns JSON with token and customerId

---

## ✅ Success! What's Next?

### Option A: Test All Endpoints
Read: `API_TESTING_GUIDE.md` for complete testing

### Option B: Connect Frontend
Read: `FRONTEND_INTEGRATION_GUIDE.md` to update React app

### Option C: Prepare Demo
Read: `PROJECT_DOCUMENTATION.md` for technical details

---

## 🐛 Troubleshooting

### "mvn: command not found"
→ Install Maven: https://maven.apache.org/download.cgi

### "java: command not found"  
→ Install Java 17: https://adoptium.net/

### "Could not connect to database"
→ Check your `application.properties` credentials

### "Port 8080 already in use"
→ Change port in `application.properties`:
```properties
server.port=8081
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `QUICK_START.md` | ⚡ This file - Get started fast |
| `SETUP_CHECKLIST.md` | 📋 Detailed setup steps |
| `API_TESTING_GUIDE.md` | 🧪 Test all endpoints |
| `FRONTEND_INTEGRATION_GUIDE.md` | 🔗 Connect React frontend |
| `PROJECT_DOCUMENTATION.md` | 📖 Full technical docs for teacher |
| `ARCHITECTURE_DIAGRAMS.md` | 📊 System architecture diagrams |
| `README.md` | 📄 Main project documentation |

---

## 🎓 For Your Teacher

**Show in this order:**

1. **Start the backend** → Show console logs
2. **Test signup endpoint** → Show password hashing
3. **Test login** → Show JWT token generation
4. **Create a massage** → Show database insert
5. **Process payment** → Show transaction logic
6. **Generate MIS report** → Show complex SQL join
7. **Explain architecture** → Use ARCHITECTURE_DIAGRAMS.md
8. **Show code** → Walk through Service layer

**Key Java Concepts to Highlight:**
- ✅ OOP (Encapsulation, Inheritance, Polymorphism)
- ✅ Spring Dependency Injection
- ✅ JPA/Hibernate ORM
- ✅ RESTful API Design
- ✅ Transaction Management
- ✅ Security (BCrypt, JWT)
- ✅ Design Patterns (MVC, Repository, DTO)

---

## 💡 Pro Tips

1. **Keep backend running** while testing - don't restart unnecessarily

2. **Check console logs** if something doesn't work - errors will show there

3. **Use Postman** for easier testing instead of curl

4. **Test incrementally** - One endpoint at a time

5. **Save responses** - You'll need customerId and massageId for later tests

---

## 🎯 Your Demo Checklist

Before showing your teacher:

- [ ] Backend starts without errors
- [ ] Can create customer account
- [ ] Can login and get JWT token
- [ ] Can create massage (if needed)
- [ ] Can add to cart
- [ ] Can process payment
- [ ] Can generate MIS report
- [ ] Understand the code flow
- [ ] Can explain OOP concepts used
- [ ] Can explain Spring Framework benefits

---

## 📞 Need Help?

**Check these files:**
1. `SETUP_CHECKLIST.md` - Detailed setup
2. `API_TESTING_GUIDE.md` - How to test
3. `PROJECT_DOCUMENTATION.md` - Technical details

**Common Questions:**

**Q: Do I need to change my frontend?**
A: Only if you want to connect it to Java backend. Otherwise, you can demo the backend standalone.

**Q: Can I show just the backend?**
A: Yes! Use Postman/curl to demonstrate all functionality.

**Q: What if I don't have massages in database?**
A: Use the POST /api/massages endpoint to create some test data.

---

**You're all set! Time to run it! 🚀**

```bash
cd java-backend
mvn spring-boot:run
```

**Good luck with your project! 💪**
