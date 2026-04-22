# SAVADHIKA Spa Booking Portal - Java Backend

## Overview
This is the Java Spring Boot backend for the SAVADHIKA spa and saloon online booking portal. It provides RESTful APIs for managing customers, massages, bookings, payments, and reports.

## Technology Stack
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA** - Database ORM
- **Spring Security** - Authentication & Authorization
- **PostgreSQL** - Database (Supabase)
- **JWT** - Token-based authentication
- **Maven** - Dependency management
- **Lombok** - Reduce boilerplate code

## Project Structure
```
java-backend/
├── src/main/java/com/savadhika/
│   ├── SavadhikaApplication.java          # Main application entry point
│   ├── config/
│   │   └── SecurityConfig.java            # Security configuration
│   ├── controller/                        # REST Controllers
│   │   ├── AuthController.java            # Authentication endpoints
│   │   ├── MassageController.java         # Massage CRUD endpoints
│   │   ├── BookingController.java         # Cart & booking endpoints
│   │   ├── PaymentController.java         # Payment processing
│   │   └── ReportController.java          # MIS reports
│   ├── service/                           # Business Logic Layer
│   │   ├── AuthService.java               # Authentication logic
│   │   ├── MassageService.java            # Massage management
│   │   ├── BookingService.java            # Booking operations
│   │   ├── CouponService.java             # Coupon validation
│   │   ├── PaymentService.java            # Payment processing
│   │   └── ReportService.java             # Report generation
│   ├── repository/                        # Data Access Layer
│   │   ├── CustomerRepository.java
│   │   ├── MassageRepository.java
│   │   ├── TransactionRepository.java
│   │   ├── CartRepository.java
│   │   ├── PaymentRepository.java
│   │   ├── CouponRepository.java
│   │   └── CouponUsageRepository.java
│   ├── model/                             # Entity Classes
│   │   ├── Customer.java
│   │   ├── Massage.java
│   │   ├── Transaction.java
│   │   ├── Cart.java
│   │   ├── Payment.java
│   │   ├── Coupon.java
│   │   └── CouponUsage.java
│   ├── dto/                               # Data Transfer Objects
│   │   ├── AuthRequest.java
│   │   ├── AuthResponse.java
│   │   ├── SignupRequest.java
│   │   ├── BookingRequest.java
│   │   ├── PaymentRequest.java
│   │   ├── CouponValidationResponse.java
│   │   └── MISReportResponse.java
│   └── util/
│       └── JwtUtil.java                   # JWT token utilities
└── src/main/resources/
    └── application.properties             # Configuration file
```

## Database Setup

### 1. Get Supabase Database Credentials

1. Go to your Supabase project dashboard
2. Click on **Settings** → **Database**
3. Copy the following:
   - **Host**: e.g., `db.xxxxxxxxxxxxx.supabase.co`
   - **Database**: `postgres`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: Your database password

### 2. Update application.properties

Edit `/java-backend/src/main/resources/application.properties`:

```properties
# Replace with your Supabase database credentials
spring.datasource.url=jdbc:postgresql://db.xxxxxxxxxxxxx.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=YOUR_SUPABASE_PASSWORD
```

## Installation & Setup

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- PostgreSQL (Supabase)

### Step 1: Clone/Navigate to Project
```bash
cd java-backend
```

### Step 2: Configure Database
Update `src/main/resources/application.properties` with your Supabase credentials (see above)

### Step 3: Build the Project
```bash
mvn clean install
```

### Step 4: Run the Application
```bash
mvn spring-boot:run
```

The server will start on: **http://localhost:8080/api**

## API Endpoints

### Authentication APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new customer |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user info |

### Massage APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/massages` | Get all massages (with filters) |
| GET | `/api/massages/{id}` | Get massage by ID |
| POST | `/api/massages` | Create massage (Admin) |
| PUT | `/api/massages/{id}` | Update massage (Admin) |
| DELETE | `/api/massages/{id}` | Delete massage (Admin) |

**Query Parameters:**
- `massageType` - Filter by type (e.g., "Head & Shoulders", "Full Body")
- `city` - Filter by city (e.g., "Mumbai", "Delhi")

### Booking APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings/cart` | Add massage to cart |
| GET | `/api/bookings/cart/{customerId}` | Get cart items |
| DELETE | `/api/bookings/cart/{cartId}` | Remove from cart |
| DELETE | `/api/bookings/cart/clear/{customerId}` | Clear cart |
| GET | `/api/bookings/cart/count/{customerId}` | Get cart count |

### Payment APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/process` | Process payment |
| POST | `/api/payments/validate-coupon` | Validate coupon code |
| GET | `/api/payments/history/{customerId}` | Get payment history |

### Report APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reports/mis` | Generate MIS report |
| GET | `/api/reports/booking-history/{customerId}` | Get booking history |

## API Request/Response Examples

### 1. Signup
**Request:**
```json
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "john@example.com",
  "name": "John Doe",
  "customerId": 1,
  "isAdmin": false,
  "message": "Signup successful"
}
```

### 2. Login
**Request:**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "john@example.com",
  "name": "John Doe",
  "customerId": 1,
  "isAdmin": false,
  "message": "Login successful"
}
```

### 3. Get Massages
**Request:**
```
GET /api/massages?massageType=Head%20%26%20Shoulders&city=Mumbai
```

**Response:**
```json
[
  {
    "massageId": 1,
    "massageName": "Relaxing Head Massage",
    "massageDescription": "A soothing massage for head and shoulders",
    "massageType": "Head & Shoulders",
    "massagePrice": 800.0,
    "massageDuration": 30,
    "massageZone": "Mumbai",
    "createdAt": "2026-03-21T10:00:00"
  }
]
```

### 4. Add to Cart
**Request:**
```json
POST /api/bookings/cart
{
  "customerId": 1,
  "massageId": 1,
  "bookingDate": "2026-03-25",
  "bookingTime": "14:00"
}
```

**Response:**
```json
{
  "success": true,
  "cartItem": {
    "cartId": 1,
    "customerId": 1,
    "massageId": 1,
    "bookingDate": "2026-03-25",
    "bookingTime": "14:00"
  },
  "message": "Added to cart successfully"
}
```

### 5. Validate Coupon
**Request:**
```json
POST /api/payments/validate-coupon
{
  "couponCode": "FIRSTTIME15",
  "customerId": 1,
  "amount": 2000.0
}
```

**Response:**
```json
{
  "valid": true,
  "message": "Coupon applied successfully!",
  "discountPercentage": 15.0,
  "discountAmount": 300.0,
  "finalAmount": 1700.0
}
```

### 6. Process Payment
**Request:**
```json
POST /api/payments/process
{
  "customerId": 1,
  "massageId": 1,
  "paymentMethod": "Credit Card",
  "paymentDetails": "Visa ending in 1234",
  "amount": 2000.0,
  "couponCode": "FIRSTTIME15"
}
```

**Response:**
```json
{
  "success": true,
  "transactionId": 1,
  "paymentId": 1,
  "amount": 1700.0,
  "discountAmount": 300.0,
  "message": "Payment processed successfully"
}
```

### 7. Generate MIS Report
**Request:**
```json
POST /api/reports/mis
{
  "startDate": "2026-03-01",
  "endDate": "2026-03-31"
}
```

**Response:**
```json
{
  "bookings": [
    {
      "trans_id": 1,
      "booking_date": "2026-03-21",
      "customer_name": "John Doe",
      "customer_email": "john@example.com",
      "customer_phone": "9876543210",
      "massage_name": "Relaxing Head Massage",
      "massage_type": "Head & Shoulders",
      "city": "Mumbai",
      "massage_price": 1700.0,
      "booking_time": "14:00"
    }
  ],
  "totalBookings": 1,
  "totalRevenue": 1700.0
}
```

## Business Logic Highlights

### 1. Authentication & Security
- **Password Hashing**: Using BCrypt for secure password storage
- **JWT Tokens**: Stateless authentication
- **Role-Based Access**: Admin vs Customer permissions

### 2. Coupon Validation System
```java
public CouponValidationResponse validateCoupon(String couponCode, Long customerId, Double amount) {
    // Check coupon exists
    // Verify coupon is active
    // Check validity dates
    // Ensure customer hasn't used it before
    // Calculate discount with max limit
    // Return validation result
}
```

### 3. Payment Processing
```java
@Transactional
public Map<String, Object> processPayment(PaymentRequest request) {
    // 1. Validate and apply coupon
    // 2. Create transaction record
    // 3. Save payment information
    // 4. Record coupon usage
    // 5. Clear customer's cart
    // 6. Return success response
}
```

### 4. MIS Report Generation
- Complex SQL join across multiple tables
- Date range filtering
- Revenue calculations
- Customer and massage details aggregation

## Testing the API

### Using Postman
1. Import the endpoints into Postman
2. Test signup/login to get JWT token
3. Use the token in Authorization header for protected endpoints

### Using curl
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get massages
curl http://localhost:8080/api/massages?city=Mumbai

# Add to cart
curl -X POST http://localhost:8080/api/bookings/cart \
  -H "Content-Type: application/json" \
  -d '{"customerId":1,"massageId":1,"bookingDate":"2026-03-25","bookingTime":"14:00"}'
```

## Deployment

### Package the application
```bash
mvn clean package
```

This creates a JAR file: `target/spa-booking-backend-1.0.0.jar`

### Run the JAR
```bash
java -jar target/spa-booking-backend-1.0.0.jar
```

## Key Java Concepts Demonstrated

1. **OOP Principles**
   - Encapsulation (private fields, getters/setters)
   - Inheritance (Entity hierarchy)
   - Polymorphism (Service interfaces)
   - Abstraction (Repository pattern)

2. **Design Patterns**
   - MVC (Model-View-Controller)
   - Repository Pattern
   - DTO Pattern
   - Dependency Injection

3. **Spring Framework**
   - Spring Boot auto-configuration
   - Spring Data JPA for database operations
   - Spring Security for authentication
   - Transactional management

4. **Database Operations**
   - JPA Entity mapping
   - JPQL queries
   - Native SQL for complex reports
   - Transaction management

## Troubleshooting

### Database Connection Issues
- Verify Supabase credentials in `application.properties`
- Check if Supabase database allows connections from your IP
- Ensure port 5432 is not blocked by firewall

### Application Won't Start
```bash
# Check Java version
java -version  # Should be 17+

# Rebuild with clean
mvn clean install -U
```

### API Returns 401 Unauthorized
- Ensure JWT token is included in Authorization header
- Check if token has expired (24 hours by default)

## Support
For issues or questions, contact the development team.

## License
© 2026 SAVADHIKA Spa Booking Portal
