# SAVADHIKA Spa Booking Portal - Java Backend Documentation

**Student Project Documentation**  
**Java Spring Boot Backend Implementation**

---

## Executive Summary

This document provides comprehensive technical documentation for the **SAVADHIKA Spa Booking Portal** backend, implemented using **Java Spring Boot**. The system demonstrates professional-grade software engineering practices, design patterns, and Java programming concepts.

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Core Java Concepts Implemented](#core-java-concepts-implemented)
4. [Database Design](#database-design)
5. [API Design & Implementation](#api-design--implementation)
6. [Business Logic Implementation](#business-logic-implementation)
7. [Security Implementation](#security-implementation)
8. [Testing & Validation](#testing--validation)

---

## System Architecture

### Three-Tier Architecture

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│     (React Frontend - Figma Make)       │
│   Buddhist-themed UI with animations    │
└──────────────┬──────────────────────────┘
               │ REST API (JSON)
               │ HTTP/HTTPS
┌──────────────▼──────────────────────────┐
│         Application Layer               │
│       (Java Spring Boot Backend)        │
│  ┌──────────────────────────────────┐   │
│  │  Controllers (REST Endpoints)    │   │
│  └────────────┬─────────────────────┘   │
│  ┌────────────▼─────────────────────┐   │
│  │  Services (Business Logic)       │   │
│  └────────────┬─────────────────────┘   │
│  ┌────────────▼─────────────────────┐   │
│  │  Repositories (Data Access)      │   │
│  └──────────────────────────────────┘   │
└──────────────┬──────────────────────────┘
               │ JDBC/JPA
               │
┌──────────────▼──────────────────────────┐
│         Data Layer                      │
│    (PostgreSQL - Supabase)              │
│  7 Tables with relationships            │
└─────────────────────────────────────────┘
```

### MVC Pattern Implementation

**Model** - Entity classes (Customer, Massage, Transaction, etc.)  
**View** - JSON responses (DTOs)  
**Controller** - REST Controllers handling HTTP requests

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Spring Boot 3.2.0 | Application framework |
| **Language** | Java 17 | Programming language |
| **ORM** | Spring Data JPA | Object-Relational Mapping |
| **Database** | PostgreSQL | Relational database |
| **Security** | Spring Security + JWT | Authentication & Authorization |
| **Build Tool** | Maven | Dependency management |
| **Server** | Embedded Tomcat | Application server |

---

## Core Java Concepts Implemented

### 1. Object-Oriented Programming (OOP)

#### A. Encapsulation
```java
@Entity
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long customerId;  // Private field
    
    private String customerName;
    private String customerEmail;
    
    // Public getters and setters
    public Long getCustomerId() {
        return customerId;
    }
    
    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }
}
```
**Demonstrates**: Data hiding, controlled access through methods

#### B. Inheritance
```java
// All JPA repositories inherit from JpaRepository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // Inherits: save(), findAll(), findById(), delete(), etc.
    // Custom methods added here
    Optional<Customer> findByCustomerEmail(String email);
}
```
**Demonstrates**: Code reuse, IS-A relationship

#### C. Polymorphism
```java
// Interface-based polymorphism
@Service
public class AuthService {
    private final CustomerRepository customerRepository;  // Interface reference
    private final PasswordEncoder passwordEncoder;        // Interface reference
    
    // Methods work with interface, actual implementation can vary
}
```
**Demonstrates**: Interface polymorphism, dependency on abstractions

#### D. Abstraction
```java
// Repository abstraction - hides complex SQL
public interface MassageRepository extends JpaRepository<Massage, Long> {
    // Abstract method - implementation handled by Spring Data JPA
    List<Massage> findByMassageTypeAndMassageZone(String type, String zone);
}
```
**Demonstrates**: Hiding implementation details, focusing on what not how

### 2. Collections Framework

```java
// Using List interface
List<Massage> massages = massageRepository.findAll();

// Using Map for response
Map<String, Object> response = new HashMap<>();
response.put("success", true);
response.put("data", massages);

// Stream API for data processing
List<Map<String, Object>> cartItems = cartRepository.findAll().stream()
    .map(cart -> {
        Map<String, Object> item = new HashMap<>();
        item.put("cartId", cart.getCartId());
        // ... more mappings
        return item;
    })
    .collect(Collectors.toList());
```

### 3. Exception Handling

```java
@PostMapping("/signup")
public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
    try {
        AuthResponse response = authService.signup(request);
        return ResponseEntity.ok(response);
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest()
            .body(new ErrorResponse(e.getMessage()));
    }
}
```

### 4. Generics

```java
// Generic repository
public interface JpaRepository<T, ID> {
    Optional<T> findById(ID id);
    List<T> findAll();
    <S extends T> S save(S entity);
}

// Generic DTO
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
}
```

### 5. Annotations & Reflection

```java
@Entity                    // JPA - marks as database entity
@Table(name = "customer_master")
@Data                      // Lombok - generates getters/setters
@NoArgsConstructor        // Lombok - generates no-arg constructor
public class Customer {
    
    @Id                    // Primary key
    @GeneratedValue       // Auto-increment
    private Long customerId;
    
    @Column(nullable = false, unique = true)
    private String customerEmail;
    
    @PrePersist           // Lifecycle callback
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

### 6. Lambda Expressions & Functional Programming

```java
// Lambda for filtering
List<Coupon> activeCoupons = coupons.stream()
    .filter(coupon -> coupon.getIsActive())
    .collect(Collectors.toList());

// Method reference
bookings.stream()
    .mapToDouble(BookingData::getMassage_price)
    .sum();

// Functional interface
Optional<Customer> customer = customerRepository.findByEmail(email);
customer.ifPresent(c -> System.out.println("Found: " + c.getName()));
```

### 7. Dependency Injection

```java
@Service
@RequiredArgsConstructor  // Lombok generates constructor
public class PaymentService {
    // Dependencies injected via constructor
    private final PaymentRepository paymentRepository;
    private final TransactionRepository transactionRepository;
    private final CouponService couponService;
    
    // Spring automatically creates and injects these
}
```

---

## Database Design

### Entity-Relationship Diagram

```
┌─────────────────┐         ┌──────────────────┐
│  customer_master│         │  massage_master  │
├─────────────────┤         ├──────────────────┤
│ custid (PK)     │         │ massid (PK)      │
│ custname        │         │ massname         │
│ custemail       │         │ masstype         │
│ custphone       │         │ massprice        │
│ custpassword    │         │ masszone (city)  │
│ isadmin         │         │ massduration     │
└────────┬────────┘         └────────┬─────────┘
         │                           │
         │  ┌────────────────────────┘
         │  │
         │  │    ┌──────────────────┐
         └──┼────┤ cust_mass_trans  │
            │    ├──────────────────┤
            │    │ trans_id (PK)    │
            │    │ custid (FK)      │
            │    │ massid (FK)      │
            │    │ datetrans        │
            │    │ coupon_code      │
            │    │ amount           │
            │    └────────┬─────────┘
            │             │
            │    ┌────────▼─────────┐
            └────┤   cart_master    │
                 ├──────────────────┤
                 │ cart_id (PK)     │
                 │ custid (FK)      │
                 │ massid (FK)      │
                 │ booking_date     │
                 │ booking_time     │
                 └──────────────────┘
```

### Table Descriptions

| Table | Purpose | Key Fields |
|-------|---------|------------|
| **customer_master** | Store customer accounts | custid, custemail, isadmin |
| **massage_master** | Therapy/massage services | massid, masstype, masszone, massprice |
| **cust_mass_trans** | Booking transactions | trans_id, custid, massid, amount |
| **cart_master** | Shopping cart items | cart_id, custid, massid, booking_date |
| **customer_payments** | Payment information | payment_id, trans_id, payment_method |
| **coupon_master** | Discount coupons | coupon_code, discount_percentage |
| **coupon_usage** | Track coupon usage | custid, coupon_code, used_at |

---

## API Design & Implementation

### RESTful API Principles

1. **Resource-Based URLs**: `/api/massages`, `/api/bookings`
2. **HTTP Methods**: GET (read), POST (create), PUT (update), DELETE (delete)
3. **Status Codes**: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized)
4. **JSON Format**: All requests and responses use JSON

### Controller Examples

#### 1. Authentication Controller

```java
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    private final AuthService authService;
    
    /**
     * POST /auth/signup
     * Registers a new customer account
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        try {
            AuthResponse response = authService.signup(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    /**
     * POST /auth/login  
     * Authenticates user and returns JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }
}
```

**Key Concepts**:
- `@RestController`: Combines @Controller + @ResponseBody
- `@RequestMapping`: Base path for all endpoints
- `@PostMapping`: Handle HTTP POST requests
- `@RequestBody`: Parse JSON request to Java object
- `@Valid`: Validate request data
- `ResponseEntity<?>`: Type-safe HTTP responses

---

## Business Logic Implementation

### 1. Coupon Validation System

**Complex business rules implemented in Java:**

```java
@Service
public class CouponService {
    
    public CouponValidationResponse validateCoupon(
        String couponCode, 
        Long customerId, 
        Double originalAmount
    ) {
        // 1. Check if coupon exists
        Coupon coupon = couponRepository.findByCouponCode(couponCode)
            .orElseThrow(() -> new RuntimeException("Invalid coupon code"));
        
        // 2. Verify coupon is active
        if (!coupon.getIsActive()) {
            throw new RuntimeException("Coupon is inactive");
        }
        
        // 3. Check validity period
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(coupon.getValidFrom()) || 
            now.isAfter(coupon.getValidUntil())) {
            throw new RuntimeException("Coupon expired");
        }
        
        // 4. Check one-time use per customer
        if (couponUsageRepository.existsByCustomerIdAndCouponCode(
            customerId, couponCode)) {
            throw new RuntimeException("Coupon already used");
        }
        
        // 5. Calculate discount with maximum limit
        Double discount = (originalAmount * coupon.getDiscountPercentage()) / 100;
        if (discount > coupon.getMaxDiscountAmount()) {
            discount = coupon.getMaxDiscountAmount();
        }
        
        // 6. Return validation result
        return new CouponValidationResponse(
            true,
            "Coupon applied successfully",
            coupon.getDiscountPercentage(),
            discount,
            originalAmount - discount
        );
    }
}
```

**Demonstrates**:
- Multi-step validation logic
- Business rule enforcement
- Exception handling
- Data transformation
- Return value optimization

### 2. Payment Processing (Transactional)

```java
@Service
public class PaymentService {
    
    @Transactional  // Ensures all-or-nothing execution
    public Map<String, Object> processPayment(PaymentRequest request) {
        Double finalAmount = request.getAmount();
        Double discountAmount = 0.0;
        
        // Step 1: Apply coupon if provided
        if (request.getCouponCode() != null) {
            CouponValidationResponse validation = 
                couponService.validateCoupon(
                    request.getCouponCode(), 
                    request.getCustomerId(), 
                    request.getAmount()
                );
            finalAmount = validation.getFinalAmount();
            discountAmount = validation.getDiscountAmount();
        }
        
        // Step 2: Create transaction record
        Transaction transaction = new Transaction();
        transaction.setCustomerId(request.getCustomerId());
        transaction.setMassageId(request.getMassageId());
        transaction.setCouponCode(request.getCouponCode());
        transaction.setAmount(finalAmount);
        Transaction savedTransaction = transactionRepository.save(transaction);
        
        // Step 3: Create payment record
        Payment payment = new Payment();
        payment.setCustomerId(request.getCustomerId());
        payment.setTransactionId(savedTransaction.getTransactionId());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentDetails(request.getPaymentDetails());
        payment.setAmount(finalAmount);
        Payment savedPayment = paymentRepository.save(payment);
        
        // Step 4: Record coupon usage
        if (request.getCouponCode() != null) {
            CouponUsage usage = new CouponUsage();
            usage.setCustomerId(request.getCustomerId());
            usage.setCouponCode(request.getCouponCode());
            usage.setTransactionId(savedTransaction.getTransactionId());
            usage.setDiscountAmount(discountAmount);
            couponUsageRepository.save(usage);
        }
        
        // Step 5: Clear customer's cart
        cartRepository.deleteByCustomerId(request.getCustomerId());
        
        // Step 6: Return success response
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("transactionId", savedTransaction.getTransactionId());
        response.put("paymentId", savedPayment.getPaymentId());
        response.put("amount", finalAmount);
        response.put("discountAmount", discountAmount);
        
        return response;
    }
}
```

**Demonstrates**:
- `@Transactional`: Database ACID properties
- Multi-step operation coordination
- Conditional logic execution
- Data consistency maintenance
- Comprehensive error handling

### 3. MIS Report Generation

```java
@Service
public class ReportService {
    
    private final JdbcTemplate jdbcTemplate;
    
    public MISReportResponse generateMISReport(String startDate, String endDate) {
        // Complex SQL join across multiple tables
        String sql = """
            SELECT 
                t.trans_id,
                t.datetrans::date as booking_date,
                c.custname as customer_name,
                c.custemail as customer_email,
                c.custphone as customer_phone,
                m.massname as massage_name,
                m.masstype as massage_type,
                m.masszone as city,
                t.amount as massage_price,
                cart.booking_time
            FROM cust_mass_trans t
            JOIN customer_master c ON t.custid = c.custid
            JOIN massage_master m ON t.massid = m.massid
            LEFT JOIN cart_master cart ON cart.custid = t.custid 
                                       AND cart.massid = t.massid
            WHERE t.datetrans::date BETWEEN ?::date AND ?::date
            ORDER BY t.datetrans DESC
        """;
        
        // Execute query and map results to Java objects
        List<BookingData> bookings = jdbcTemplate.query(
            sql,
            new Object[]{startDate, endDate},
            (rs, rowNum) -> {
                BookingData booking = new BookingData();
                booking.setTrans_id(rs.getLong("trans_id"));
                booking.setBooking_date(rs.getString("booking_date"));
                booking.setCustomer_name(rs.getString("customer_name"));
                booking.setCustomer_email(rs.getString("customer_email"));
                booking.setCustomer_phone(rs.getString("customer_phone"));
                booking.setMassage_name(rs.getString("massage_name"));
                booking.setMassage_type(rs.getString("massage_type"));
                booking.setCity(rs.getString("city"));
                booking.setMassage_price(rs.getDouble("massage_price"));
                booking.setBooking_time(rs.getString("booking_time"));
                return booking;
            }
        );
        
        // Calculate aggregations
        Integer totalBookings = bookings.size();
        Double totalRevenue = bookings.stream()
            .mapToDouble(BookingData::getMassage_price)
            .sum();
        
        // Build response
        MISReportResponse response = new MISReportResponse();
        response.setBookings(bookings);
        response.setTotalBookings(totalBookings);
        response.setTotalRevenue(totalRevenue);
        
        return response;
    }
}
```

**Demonstrates**:
- JDBC Template usage
- Complex SQL queries
- Result set mapping
- Stream API for calculations
- Multi-table joins
- Business analytics

---

## Security Implementation

### 1. Password Encryption

```java
@Configuration
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();  // One-way hash
    }
}

// Usage in AuthService
@Service
public class AuthService {
    
    public void signup(SignupRequest request) {
        Customer customer = new Customer();
        // Password is hashed, never stored in plain text
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        customerRepository.save(customer);
    }
    
    public void login(AuthRequest request) {
        Customer customer = findByEmail(request.getEmail());
        // Verify password using BCrypt matching
        if (!passwordEncoder.matches(request.getPassword(), 
                                      customer.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
    }
}
```

### 2. JWT Authentication

```java
@Component
public class JwtUtil {
    
    @Value("${jwt.secret}")
    private String secret;
    
    // Generate token
    public String generateToken(String email) {
        return Jwts.builder()
            .setSubject(email)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 86400000))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }
    
    // Validate token
    public Boolean validateToken(String token, String email) {
        String tokenEmail = extractEmail(token);
        return tokenEmail.equals(email) && !isTokenExpired(token);
    }
}
```

### 3. Role-Based Access Control

```java
@Configuration
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http.authorizeHttpRequests(auth -> auth
            // Public endpoints
            .requestMatchers("/auth/**", "/massages/**").permitAll()
            // Admin-only endpoints
            .requestMatchers("/admin/**").hasAuthority("ADMIN")
            // All others require authentication
            .anyRequest().authenticated()
        );
        return http.build();
    }
}
```

---

## Testing & Validation

### 1. Input Validation

```java
@Data
public class SignupRequest {
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100)
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotBlank(message = "Phone is required")
    @Size(min = 10, max = 15)
    private String phone;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6)
    private String password;
}

// Controller automatically validates
@PostMapping("/signup")
public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
    // If validation fails, returns 400 Bad Request automatically
}
```

### 2. API Testing Examples

**Test 1: Create Customer Account**
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

**Test 2: Get Filtered Massages**
```bash
curl "http://localhost:8080/api/massages?massageType=Full%20Body&city=Mumbai"
```

**Test 3: Process Payment**
```bash
curl -X POST http://localhost:8080/api/payments/process \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "massageId": 1,
    "paymentMethod": "Credit Card",
    "amount": 2000,
    "couponCode": "FIRSTTIME15"
  }'
```

---

## Key Learning Outcomes

### Java Programming Concepts
✅ Object-Oriented Programming (Encapsulation, Inheritance, Polymorphism, Abstraction)  
✅ Collections Framework (List, Map, Set, Stream API)  
✅ Exception Handling (try-catch, custom exceptions)  
✅ Generics and Type Safety  
✅ Lambda Expressions and Functional Programming  
✅ Annotations and Reflection  

### Spring Framework
✅ Dependency Injection / Inversion of Control  
✅ Spring Boot Auto-Configuration  
✅ Spring Data JPA (ORM)  
✅ Spring Security (Authentication & Authorization)  
✅ RESTful Web Services  
✅ Transaction Management  

### Database & SQL
✅ Relational Database Design  
✅ JPA Entity Mapping  
✅ JPQL and Native Queries  
✅ Database Transactions (ACID)  
✅ Primary Keys and Foreign Keys  
✅ Table Joins and Relationships  

### Software Engineering
✅ MVC Architecture Pattern  
✅ Repository Pattern  
✅ DTO (Data Transfer Object) Pattern  
✅ RESTful API Design  
✅ Business Logic Separation  
✅ Code Organization and Modularity  

### Security
✅ Password Hashing (BCrypt)  
✅ JWT Token Authentication  
✅ Role-Based Access Control  
✅ Input Validation  
✅ CORS Configuration  

---

## Conclusion

This Java Spring Boot backend demonstrates enterprise-level software development practices, implementing a complete booking system with authentication, payment processing, coupon validation, and reporting capabilities. The code showcases strong understanding of Java programming, OOP principles, Spring Framework, database design, and RESTful API development.

**Lines of Code**: ~2,500+ lines of Java  
**Classes**: 30+ (Entities, DTOs, Services, Controllers, Repositories)  
**API Endpoints**: 20+ RESTful endpoints  
**Database Tables**: 7 tables with relationships  
**Design Patterns**: MVC, Repository, DTO, Dependency Injection  

---

**Project By**: [Your Name]  
**Date**: March 21, 2026  
**Course**: [Your Course Name]  
**Institution**: [Your Institution]
