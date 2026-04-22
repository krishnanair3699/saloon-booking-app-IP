# Java Backend Setup Checklist

## ✅ Complete Setup Guide for SAVADHIKA Java Backend

---

## Prerequisites Check

- [ ] **Java 17 or higher** installed
  ```bash
  java -version
  # Should show: java version "17.x.x" or higher
  ```

- [ ] **Maven 3.6+** installed
  ```bash
  mvn -version
  # Should show: Apache Maven 3.6.x or higher
  ```

- [ ] **Supabase Project** exists with tables created

- [ ] **IDE** (Optional but recommended)
  - IntelliJ IDEA (Recommended)
  - Eclipse
  - VS Code with Java extensions

---

## Step-by-Step Setup

### 1. Get Supabase Database Credentials

- [ ] Login to [Supabase Dashboard](https://supabase.com/dashboard)
- [ ] Select your SAVADHIKA project
- [ ] Go to **Settings** → **Database**
- [ ] Copy the following information:

```
Host: db.xxxxxxxxxxxxx.supabase.co
Database: postgres
Port: 5432
User: postgres
Password: [Your password]
```

---

### 2. Configure Application Properties

- [ ] Open `/java-backend/src/main/resources/application.properties`
- [ ] Update these lines with your Supabase credentials:

```properties
# Update this URL with your Supabase host
spring.datasource.url=jdbc:postgresql://db.XXXXX.supabase.co:5432/postgres

# Update this with your Supabase password
spring.datasource.password=YOUR_ACTUAL_PASSWORD
```

**Example:**
```properties
spring.datasource.url=jdbc:postgresql://db.abcdefghijklmn.supabase.co:5432/postgres
spring.datasource.password=MySecurePassword123!
```

---

### 3. Build the Project

- [ ] Open terminal/command prompt
- [ ] Navigate to java-backend folder:
  ```bash
  cd java-backend
  ```

- [ ] Run Maven build:
  ```bash
  mvn clean install
  ```

- [ ] Wait for build to complete (may take 2-5 minutes first time)
- [ ] Look for `BUILD SUCCESS` message

**Expected Output:**
```
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  2.345 s
[INFO] Finished at: 2026-03-21T10:30:00+05:30
[INFO] ------------------------------------------------------------------------
```

---

### 4. Run the Application

- [ ] Start the Spring Boot application:
  ```bash
  mvn spring-boot:run
  ```

- [ ] Wait for the application to start
- [ ] Look for these messages:

```
================================
SAVADHIKA Spa Booking Backend
Server running on: http://localhost:8080/api
================================
```

**Full startup log will show:**
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)

[main] INFO  com.savadhika.SavadhikaApplication - Starting...
[main] INFO  o.s.b.w.embedded.tomcat.TomcatWebServer - Tomcat started on port(s): 8080
```

---

### 5. Test the API

#### Test 1: Health Check
- [ ] Open browser or use curl:
  ```bash
  curl http://localhost:8080/api/massages
  ```
- [ ] Should return list of massages (or empty array `[]`)

#### Test 2: Create Test Account
- [ ] Use Postman or curl:
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

- [ ] Should return success with JWT token:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "email": "test@example.com",
    "name": "Test User",
    "customerId": 1,
    "isAdmin": false,
    "message": "Signup successful"
  }
  ```

#### Test 3: Login
- [ ] Test login endpoint:
  ```bash
  curl -X POST http://localhost:8080/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "password": "test123"
    }'
  ```

- [ ] Should return same token structure

---

## Troubleshooting Guide

### ❌ Problem: "mvn: command not found"
**Solution:**
- Maven is not installed
- Download from: https://maven.apache.org/download.cgi
- Follow installation guide for your OS

### ❌ Problem: "java: command not found"
**Solution:**
- Java is not installed or not in PATH
- Download Java 17 from: https://adoptium.net/
- Set JAVA_HOME environment variable

### ❌ Problem: "Could not connect to database"
**Solution:**
- Check Supabase credentials in `application.properties`
- Verify Supabase project is active
- Check internet connection
- Ensure port 5432 is not blocked by firewall

### ❌ Problem: "Port 8080 already in use"
**Solution:**
- Another application is using port 8080
- Option 1: Stop the other application
- Option 2: Change port in `application.properties`:
  ```properties
  server.port=8081
  ```

### ❌ Problem: "BUILD FAILURE" during mvn install
**Solution:**
- Check Java version: `java -version` (must be 17+)
- Delete `.m2` cache and retry:
  ```bash
  rm -rf ~/.m2/repository
  mvn clean install
  ```

### ❌ Problem: "Table 'customer_master' doesn't exist"
**Solution:**
- Tables not created in Supabase
- Go to Supabase dashboard → SQL Editor
- Run table creation scripts (should already exist from previous setup)

---

## Verification Checklist

### Database Connection
- [ ] Application starts without errors
- [ ] No "Connection refused" messages in logs
- [ ] Can query database tables

### API Endpoints Working
- [ ] `/api/auth/signup` - Creates new customer
- [ ] `/api/auth/login` - Returns JWT token
- [ ] `/api/massages` - Returns massage list
- [ ] `/api/bookings/cart` - Can add to cart
- [ ] `/api/payments/process` - Can process payment
- [ ] `/api/reports/mis` - Generates report

### Security
- [ ] Passwords are hashed in database (not plain text)
- [ ] JWT tokens are generated correctly
- [ ] CORS is configured for frontend

---

## IDE Setup (Optional)

### IntelliJ IDEA
1. [ ] Open IntelliJ IDEA
2. [ ] File → Open → Select `java-backend` folder
3. [ ] Wait for Maven import to complete
4. [ ] Right-click `SavadhikaApplication.java`
5. [ ] Select "Run 'SavadhikaApplication'"

### VS Code
1. [ ] Install "Extension Pack for Java"
2. [ ] Install "Spring Boot Extension Pack"
3. [ ] Open `java-backend` folder
4. [ ] Press F5 to run

---

## Production Deployment Checklist

### Before Deployment
- [ ] Change `jwt.secret` in `application.properties`
- [ ] Set strong database password
- [ ] Configure proper CORS origins
- [ ] Enable HTTPS
- [ ] Set up environment variables for sensitive data
- [ ] Configure logging level to INFO (not DEBUG)

### Package Application
```bash
mvn clean package
```

### Run JAR File
```bash
java -jar target/spa-booking-backend-1.0.0.jar
```

---

## Success Criteria

✅ **You'll know everything is working when:**

1. Application starts without errors
2. You can create a customer account via API
3. You can login and receive a JWT token
4. You can fetch massages from database
5. You can add items to cart
6. You can process a payment
7. MIS report generates successfully
8. Frontend can connect and display data

---

## Next Steps

Once backend is running:

1. [ ] Test all endpoints with Postman
2. [ ] Update frontend to call Java backend (see FRONTEND_INTEGRATION_GUIDE.md)
3. [ ] Test complete booking flow
4. [ ] Prepare demo for your teacher
5. [ ] Document any customizations made

---

## Support Resources

- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **Spring Data JPA**: https://spring.io/projects/spring-data-jpa
- **JWT Java**: https://github.com/jwtk/jjwt
- **Supabase Docs**: https://supabase.com/docs

---

## Final Checklist Before Showing Teacher

- [ ] Java backend runs successfully
- [ ] All API endpoints tested and working
- [ ] Database connection verified
- [ ] Sample data in database (customers, massages)
- [ ] Can demonstrate complete booking flow
- [ ] Code is well-commented
- [ ] README documentation is clear
- [ ] Project demonstrates Java OOP concepts
- [ ] Understands the architecture and can explain

---

**🎉 Congratulations!** 

Your Java Spring Boot backend is ready to demonstrate professional-level enterprise application development!

**Remember**: Your UI remains exactly the same. Only the backend technology changed to showcase your Java skills! 🚀
