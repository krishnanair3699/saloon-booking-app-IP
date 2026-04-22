# SAVADHIKA - System Architecture Diagrams

## 1. Overall System Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Browser)                      │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │         React Frontend (Figma Make)                  │    │
│  │  - Buddhist-themed UI                                │    │
│  │  - Multi-language (EN/HI/MR)                        │    │
│  │  - Animations & Lotus Buttons                       │    │
│  │  - City Selection (Mumbai/Delhi)                    │    │
│  └────────────────┬─────────────────────────────────────┘    │
└─────────────────────┼─────────────────────────────────────────┘
                      │
                      │ HTTP/HTTPS
                      │ REST API (JSON)
                      │
┌─────────────────────▼─────────────────────────────────────────┐
│              APPLICATION SERVER LAYER                          │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │         Java Spring Boot Backend                     │    │
│  │              Port: 8080                              │    │
│  │                                                      │    │
│  │  ┌────────────────────────────────────────────┐    │    │
│  │  │  CONTROLLER LAYER (REST APIs)              │    │    │
│  │  │  - AuthController                          │    │    │
│  │  │  - MassageController                       │    │    │
│  │  │  - BookingController                       │    │    │
│  │  │  - PaymentController                       │    │    │
│  │  │  - ReportController                        │    │    │
│  │  └──────────────┬─────────────────────────────┘    │    │
│  │                 │                                    │    │
│  │  ┌──────────────▼─────────────────────────────┐    │    │
│  │  │  SERVICE LAYER (Business Logic)            │    │    │
│  │  │  - AuthService                             │    │    │
│  │  │  - MassageService                          │    │    │
│  │  │  - BookingService                          │    │    │
│  │  │  - CouponService                           │    │    │
│  │  │  - PaymentService                          │    │    │
│  │  │  - ReportService                           │    │    │
│  │  └──────────────┬─────────────────────────────┘    │    │
│  │                 │                                    │    │
│  │  ┌──────────────▼─────────────────────────────┐    │    │
│  │  │  REPOSITORY LAYER (Data Access)            │    │    │
│  │  │  - CustomerRepository                      │    │    │
│  │  │  - MassageRepository                       │    │    │
│  │  │  - TransactionRepository                   │    │    │
│  │  │  - CartRepository                          │    │    │
│  │  │  - PaymentRepository                       │    │    │
│  │  │  - CouponRepository                        │    │    │
│  │  └──────────────┬─────────────────────────────┘    │    │
│  └─────────────────┼──────────────────────────────────┘    │
└────────────────────┼───────────────────────────────────────┘
                     │
                     │ JDBC/JPA (ORM)
                     │ SQL Queries
                     │
┌────────────────────▼───────────────────────────────────────┐
│                   DATABASE LAYER                            │
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │         PostgreSQL (Supabase)                     │    │
│  │                                                   │    │
│  │  Tables:                                          │    │
│  │  - customer_master (Users)                       │    │
│  │  - massage_master (Services)                     │    │
│  │  - cust_mass_trans (Bookings)                    │    │
│  │  - cart_master (Shopping Cart)                   │    │
│  │  - customer_payments (Payments)                  │    │
│  │  - coupon_master (Coupons)                       │    │
│  │  - coupon_usage (Coupon Tracking)                │    │
│  └───────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Request Flow Diagram

### Example: Customer Makes a Booking

```
┌──────────┐
│  User    │
│  Browser │
└────┬─────┘
     │
     │ 1. User selects massage,
     │    date, time and clicks
     │    "Add to Cart"
     ▼
┌────────────────────┐
│  React Frontend    │
│  (Services.tsx)    │
└────┬───────────────┘
     │
     │ 2. POST /api/bookings/cart
     │    { customerId: 1,
     │      massageId: 5,
     │      bookingDate: "2026-03-25",
     │      bookingTime: "14:00" }
     ▼
┌────────────────────────┐
│  BookingController     │
│  @PostMapping("/cart") │
└────┬───────────────────┘
     │
     │ 3. Call service method
     │    addToCart(request)
     ▼
┌─────────────────────┐
│  BookingService     │
│  (Business Logic)   │
└────┬────────────────┘
     │
     │ 4. Verify massage exists
     │    Create cart object
     │    Save to database
     ▼
┌─────────────────────┐
│  CartRepository     │
│  (JPA Interface)    │
└────┬────────────────┘
     │
     │ 5. INSERT INTO cart_master
     │    (custid, massid, booking_date, booking_time)
     ▼
┌─────────────────────┐
│  PostgreSQL         │
│  Database           │
└────┬────────────────┘
     │
     │ 6. Return saved cart record
     │    Cart { cartId: 123, ... }
     ▼
┌─────────────────────┐
│  BookingService     │
└────┬────────────────┘
     │
     │ 7. Return success response
     │    { success: true,
     │      cartItem: {...},
     │      message: "Added to cart" }
     ▼
┌────────────────────────┐
│  BookingController     │
└────┬───────────────────┘
     │
     │ 8. HTTP 200 OK
     │    JSON response
     ▼
┌────────────────────┐
│  React Frontend    │
│  Updates UI        │
│  Shows cart count  │
└────┬───────────────┘
     │
     │ 9. Display success
     │    message to user
     ▼
┌──────────┐
│  User    │
│  sees    │
│  cart    │
│  updated │
└──────────┘
```

---

## 3. Payment Processing Flow

```
┌─────────────────────────────────────────────────────────┐
│              PAYMENT PROCESSING FLOW                    │
└─────────────────────────────────────────────────────────┘

User enters payment details and clicks "Pay Now"
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│  PaymentController.processPayment()                    │
└────┬───────────────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────────────────────┐
│  PaymentService.processPayment()                       │
│  ┌──────────────────────────────────────────────┐     │
│  │  STEP 1: Validate Coupon (if provided)      │     │
│  │  - Check coupon exists                       │     │
│  │  - Verify it's active                        │     │
│  │  - Check expiry date                         │     │
│  │  - Ensure customer hasn't used it            │     │
│  │  - Calculate discount amount                 │     │
│  │  - Apply max discount limit                  │     │
│  └──────────────┬───────────────────────────────┘     │
│                 │                                       │
│  ┌──────────────▼───────────────────────────────┐     │
│  │  STEP 2: Create Transaction Record          │     │
│  │  - Insert into cust_mass_trans table        │     │
│  │  - Store: custid, massid, amount, coupon    │     │
│  │  - Auto-generate transaction ID              │     │
│  └──────────────┬───────────────────────────────┘     │
│                 │                                       │
│  ┌──────────────▼───────────────────────────────┐     │
│  │  STEP 3: Create Payment Record              │     │
│  │  - Insert into customer_payments table       │     │
│  │  - Store: payment_method, details, amount    │     │
│  │  - Link to transaction via trans_id          │     │
│  └──────────────┬───────────────────────────────┘     │
│                 │                                       │
│  ┌──────────────▼───────────────────────────────┐     │
│  │  STEP 4: Record Coupon Usage                │     │
│  │  - Insert into coupon_usage table            │     │
│  │  - Prevent reuse by same customer            │     │
│  │  - Track discount amount given               │     │
│  └──────────────┬───────────────────────────────┘     │
│                 │                                       │
│  ┌──────────────▼───────────────────────────────┐     │
│  │  STEP 5: Clear Customer Cart                │     │
│  │  - DELETE FROM cart_master                   │     │
│  │  - WHERE custid = current customer           │     │
│  └──────────────┬───────────────────────────────┘     │
│                 │                                       │
│  ┌──────────────▼───────────────────────────────┐     │
│  │  STEP 6: Return Success Response             │     │
│  │  {                                            │     │
│  │    success: true,                             │     │
│  │    transactionId: 123,                        │     │
│  │    paymentId: 456,                            │     │
│  │    amount: 1700.00,                           │     │
│  │    discountAmount: 300.00                     │     │
│  │  }                                            │     │
│  └───────────────────────────────────────────────┘     │
└──────────────────┬─────────────────────────────────────┘
                   │
                   ▼
        Frontend shows confirmation page
```

**Note**: All steps execute in a single transaction (@Transactional)
If any step fails, all changes are rolled back!

---

## 4. Database Entity Relationships

```
┌─────────────────────┐
│  customer_master    │
│  (User Accounts)    │
├─────────────────────┤
│ PK: custid         │
│     custname        │
│     custemail       │
│     custphone       │
│     custpassword    │
│     isadmin         │
└──────┬──────────────┘
       │
       │ 1:N (One customer has many bookings)
       │
       ├──────────────────────────────────┐
       │                                  │
       │                                  │
┌──────▼──────────────┐          ┌───────▼─────────────┐
│  cart_master        │          │  cust_mass_trans    │
│  (Shopping Cart)    │          │  (Transactions)     │
├─────────────────────┤          ├─────────────────────┤
│ PK: cart_id        │          │ PK: trans_id       │
│ FK: custid         │          │ FK: custid         │
│ FK: massid         │          │ FK: massid         │
│     booking_date    │          │     datetrans       │
│     booking_time    │          │     coupon_code     │
└─────────┬───────────┘          │     amount          │
          │                      └─────────┬───────────┘
          │                                │
          │                                │ 1:1
          │                                │
          │                      ┌─────────▼───────────┐
          │                      │  customer_payments  │
          │                      │  (Payment Details)  │
          │                      ├─────────────────────┤
          │                      │ PK: payment_id     │
          │                      │ FK: custid         │
          │                      │ FK: trans_id       │
          │                      │     payment_method  │
          │                      │     payment_details │
          │                      │     amount          │
          │                      └─────────────────────┘
          │
          │ N:1 (Many cart items for one massage)
          │
┌─────────▼───────────┐
│  massage_master     │
│  (Services)         │
├─────────────────────┤
│ PK: massid         │
│     massname        │
│     massdesc        │
│     masstype        │
│     massprice       │
│     massduration    │
│     masszone (city) │
└─────────────────────┘


┌─────────────────────┐          ┌─────────────────────┐
│  coupon_master      │          │  coupon_usage       │
│  (Coupon Codes)     │          │  (Usage Tracking)   │
├─────────────────────┤          ├─────────────────────┤
│ PK: coupon_id      │          │ PK: usage_id       │
│     coupon_code     │ 1:N      │ FK: custid         │
│     discount_%      ├──────────┤     coupon_code     │
│     max_discount    │          │     trans_id        │
│     valid_from      │          │     discount_amount │
│     valid_until     │          │     used_at         │
│     is_active       │          └─────────────────────┘
└─────────────────────┘
```

---

## 5. MIS Report Data Flow

```
┌──────────────────────────────────────────────────────────┐
│  Admin opens MIS Report and selects date range          │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│  ReportController.generateMISReport()                  │
│  POST /api/reports/mis                                 │
│  { startDate: "2026-03-01", endDate: "2026-03-31" }   │
└────────────────┬───────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│  ReportService.generateMISReport()                     │
│                                                        │
│  Executes complex SQL JOIN query:                     │
│                                                        │
│  SELECT                                                │
│    t.trans_id,                                         │
│    t.datetrans,                                        │
│    c.custname,          ← From customer_master        │
│    c.custemail,                                        │
│    c.custphone,                                        │
│    m.massname,          ← From massage_master         │
│    m.masstype,                                         │
│    m.masszone,                                         │
│    t.amount,            ← From cust_mass_trans        │
│    cart.booking_time    ← From cart_master            │
│  FROM cust_mass_trans t                                │
│  JOIN customer_master c ON t.custid = c.custid        │
│  JOIN massage_master m ON t.massid = m.massid         │
│  LEFT JOIN cart_master cart                            │
│    ON cart.custid = t.custid AND cart.massid = t.massid│
│  WHERE t.datetrans BETWEEN ? AND ?                     │
│  ORDER BY t.datetrans DESC                             │
└────────────────┬───────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│  PostgreSQL executes query                             │
│  Returns result set (rows of data)                     │
└────────────────┬───────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│  JdbcTemplate maps ResultSet to BookingData objects    │
│                                                        │
│  List<BookingData> bookings = new ArrayList<>();      │
│  for each row:                                         │
│    BookingData data = new BookingData();              │
│    data.setTrans_id(rs.getLong("trans_id"));         │
│    data.setCustomer_name(rs.getString("custname"));   │
│    ...                                                 │
│    bookings.add(data);                                 │
└────────────────┬───────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│  Calculate aggregations using Stream API               │
│                                                        │
│  totalBookings = bookings.size();                      │
│  totalRevenue = bookings.stream()                      │
│    .mapToDouble(BookingData::getMassage_price)        │
│    .sum();                                             │
└────────────────┬───────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│  Return MISReportResponse                              │
│  {                                                     │
│    bookings: [ {...}, {...}, ... ],                   │
│    totalBookings: 25,                                  │
│    totalRevenue: 42500.00                              │
│  }                                                     │
└────────────────┬───────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│  Frontend displays table and charts                    │
│  - Booking list                                        │
│  - Total revenue card                                  │
│  - Average booking card                                │
│  - Export to CSV option                                │
└────────────────────────────────────────────────────────┘
```

---

## 6. Spring Framework Component Interaction

```
┌─────────────────────────────────────────────────────────┐
│            SPRING BOOT APPLICATION                      │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  @SpringBootApplication                          │  │
│  │  SavadhikaApplication.main()                     │  │
│  │                                                  │  │
│  │  - Scans for components                          │  │
│  │  - Auto-configures beans                         │  │
│  │  - Starts embedded Tomcat server                 │  │
│  └──────────┬───────────────────────────────────────┘  │
│             │                                           │
│             │ Spring Container (IoC)                    │
│             │ Manages all beans                         │
│             │                                           │
│  ┌──────────▼───────────────────────────────────────┐  │
│  │  BEAN FACTORY & DEPENDENCY INJECTION             │  │
│  │                                                  │  │
│  │  Creates and wires:                              │  │
│  │                                                  │  │
│  │  ┌────────────────┐    ┌──────────────────┐     │  │
│  │  │ @RestController│    │    @Service      │     │  │
│  │  │                │    │                  │     │  │
│  │  │ AuthController ├───►│  AuthService     │     │  │
│  │  │                │    │                  │     │  │
│  │  │ - signUp()     │    │ - passwordEncoder│     │  │
│  │  │ - login()      │    │ - jwtUtil        │     │  │
│  │  └────────────────┘    │ - repository     │     │  │
│  │                        └─────────┬────────┘     │  │
│  │                                  │              │  │
│  │                        ┌─────────▼────────┐     │  │
│  │                        │   @Repository    │     │  │
│  │                        │                  │     │  │
│  │                        │CustomerRepository│     │  │
│  │                        │                  │     │  │
│  │                        │- findByEmail()   │     │  │
│  │                        │- save()          │     │  │
│  │                        └─────────┬────────┘     │  │
│  │                                  │              │  │
│  │                        ┌─────────▼────────┐     │  │
│  │                        │   @Entity        │     │  │
│  │                        │                  │     │  │
│  │                        │    Customer      │     │  │
│  │                        │                  │     │  │
│  │                        │  JPA Mapping     │     │  │
│  │                        └──────────────────┘     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  CROSS-CUTTING CONCERNS (AOP)                    │  │
│  │                                                  │  │
│  │  - @Transactional (Transaction Management)       │  │
│  │  - Spring Security (Authentication)              │  │
│  │  - Exception Handling (@ControllerAdvice)        │  │
│  │  - Logging                                       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Security Architecture

```
┌──────────────────────────────────────────────────────┐
│  CLIENT REQUEST                                      │
│  POST /api/auth/login                                │
│  { email: "user@example.com", password: "pass123" } │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│  Spring Security Filter Chain                          │
│  - CORS Filter                                         │
│  - Security Context Filter                             │
│  - Authentication Filter                               │
└────────────────┬───────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│  AuthController.login()                                │
│  Receives plain password                               │
└────────────────┬───────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│  AuthService.login()                                   │
│                                                        │
│  1. Find customer by email                             │
│  2. Get hashed password from database:                 │
│     "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl..."        │
│                                                        │
│  3. Use BCryptPasswordEncoder to verify:               │
│     passwordEncoder.matches(                           │
│       plainPassword,    ← "pass123"                    │
│       hashedPassword    ← "$2a$10$..."                 │
│     )                                                  │
│                                                        │
│  4. If match, generate JWT token:                      │
│     JwtUtil.generateToken(email)                       │
│                                                        │
│     Token structure:                                   │
│     Header.Payload.Signature                           │
│     eyJhbGc...eyJzdWI...SflKxwRJ                       │
│                                                        │
│  5. Return token to client                             │
└────────────────┬───────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│  Response:                                             │
│  {                                                     │
│    "token": "eyJhbGciOiJIUzI1NiIsInR5cCIOi...",      │
│    "email": "user@example.com",                        │
│    "name": "John Doe",                                 │
│    "isAdmin": false                                    │
│  }                                                     │
└────────────────┬───────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│  Client stores token in localStorage                   │
│  Uses in subsequent requests:                          │
│  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI... │
└────────────────────────────────────────────────────────┘


For Protected Endpoints:
┌────────────────────────────────────────────────────────┐
│  GET /api/bookings/cart/123                            │
│  Authorization: Bearer eyJhbGci...                     │
└────────────────┬───────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│  JWT Authentication Filter                             │
│  1. Extract token from header                          │
│  2. Validate signature                                 │
│  3. Check expiration                                   │
│  4. Extract user email                                 │
│  5. Set SecurityContext                                │
└────────────────┬───────────────────────────────────────┘
                 │
                 ▼ (If valid)
┌────────────────────────────────────────────────────────┐
│  Controller method executes                            │
│  User is authenticated ✓                               │
└────────────────────────────────────────────────────────┘
```

---

**End of Architecture Diagrams**

These diagrams illustrate:
- 3-tier architecture
- Request-response flow
- Payment processing logic
- Database relationships
- Report generation
- Spring dependency injection
- Security implementation
