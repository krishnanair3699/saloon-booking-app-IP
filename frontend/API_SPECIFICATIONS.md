# API Specifications for Spring Boot Backend

Complete REST API documentation for the Savadhika Thai Massage Booking System.

---

## 🔐 Authentication

### 1. Sign Up

**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "9876543210",
  "city": "Mumbai"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "9876543210",
    "city": "Mumbai"
  }
}
```

**Response (Error - 400):**
```json
{
  "error": "Email already exists"
}
```

---

### 2. Sign In

**Endpoint:** `POST /api/auth/signin`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Special Case - Admin Login:**
```json
{
  "email": "admin",
  "password": "admin"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "9876543210",
    "city": "Mumbai",
    "is_admin": false
  }
}
```

**Admin Response:**
```json
{
  "success": true,
  "access_token": "admin-token-special",
  "user": {
    "id": "admin",
    "email": "admin@admin.com",
    "name": "Administrator",
    "phone": "N/A",
    "is_admin": true
  }
}
```

**Response (Error - 401):**
```json
{
  "error": "Invalid email or password"
}
```

---

### 3. Get Current User

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (Success - 200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "9876543210",
    "city": "Mumbai"
  }
}
```

---

## 💆 Massage Services

### 4. Get All Massages

**Endpoint:** `GET /api/massages`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (Success - 200):**
```json
{
  "massages": [
    {
      "id": 1,
      "massagename": "Thai Leg Massage",
      "massagetype": "Lower Body",
      "duration": 60,
      "price": 1200,
      "massagezone": "Mumbai",
      "Description": "Traditional Thai techniques for lower body relief"
    },
    {
      "id": 2,
      "massagename": "Hot Stone Back",
      "massagetype": "Torso",
      "duration": 75,
      "price": 1800,
      "massagezone": "Mumbai",
      "Description": "Heated basalt stones for deep muscle relaxation"
    }
  ]
}
```

---

### 5. Initialize Massage Data (One-time setup)

**Endpoint:** `POST /api/massages/initialize`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "20 massages initialized successfully",
  "count": 20
}
```

**Response (Already Initialized - 200):**
```json
{
  "success": true,
  "message": "Database already initialized",
  "alreadyInitialized": true
}
```

---

## 🛒 Cart Management

### 6. Add to Cart

**Endpoint:** `POST /api/cart/add`

**Headers:**
```
Authorization: Bearer {access_token}
X-User-Token: {custom_token}  (alternative auth header)
```

**Request Body:**
```json
{
  "massage_id": 5
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Added to cart successfully",
  "cartItem": {
    "id": 1,
    "customerid": 3,
    "massageid": 5,
    "quantity": 1,
    "transactiondate": "2026-04-22T10:30:00Z"
  }
}
```

**Response (Error - 401):**
```json
{
  "code": 401,
  "message": "Unauthorized"
}
```

---

### 7. Get Cart Items

**Endpoint:** `GET /api/cart/items`

**Headers:**
```
Authorization: Bearer {access_token}
X-User-Token: {custom_token}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "items": [
    {
      "id": 1,
      "customerid": 3,
      "massageid": 5,
      "quantity": 1,
      "amount": 1400,
      "transactiondate": "2026-04-22T10:30:00Z",
      "massage": {
        "id": 5,
        "name": "Thai Torso Massage",
        "price": 1400,
        "duration": "60 min",
        "massage_zone": "Mumbai",
        "description": "Core balancing and spinal alignment",
        "body_area": "Torso"
      }
    }
  ]
}
```

---

### 8. Remove Cart Item

**Endpoint:** `DELETE /api/cart/remove/{itemId}`

**Headers:**
```
Authorization: Bearer {access_token}
X-User-Token: {custom_token}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

### 9. Clear Cart

**Endpoint:** `DELETE /api/cart/clear`

**Headers:**
```
Authorization: Bearer {access_token}
X-User-Token: {custom_token}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "itemsDeleted": 3
}
```

---

## 💳 Payment

### 10. Create Payment Order

**Endpoint:** `POST /api/payment/create-order`

**Headers:**
```
Authorization: Bearer {access_token}
X-User-Token: {custom_token}
```

**Request Body:**
```json
{
  "amount": 4200,
  "currency": "INR",
  "coupon_code": "SAVE10"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "order_id": "order_1713779400000",
  "amount": 420000,
  "currency": "INR",
  "razorpay_key": "rzp_live_your_key_here",
  "note": "Demo mode - Replace with actual Razorpay integration"
}
```

---

### 11. Verify Payment

**Endpoint:** `POST /api/payment/verify`

**Headers:**
```
Authorization: Bearer {access_token}
X-User-Token: {custom_token}
```

**Request Body:**
```json
{
  "razorpay_payment_id": "pay_123456789",
  "razorpay_order_id": "order_1713779400000",
  "razorpay_signature": "abc123signature"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Payment verified successfully"
}
```

---

### 12. Store Payment Information

**Endpoint:** `POST /api/payment/store-info`

**Request Body:**
```json
{
  "customerId": 3,
  "paymentMethod": "upi",
  "amount": 1400,
  "selectedOption": "gpay",
  "upiDetails": "user@paytm",
  "cardDetails": "4111111111111111",
  "bankName": "HDFC Bank"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "paymentInfo": {
    "id": 1,
    "customerid": 3,
    "paymentdetails": "UPI Payment via Google Pay. Amount: ₹1400"
  }
}
```

---

## 📊 Transactions

### 13. Create Transaction

**Endpoint:** `POST /api/transaction/create`

**Request Body:**
```json
{
  "customerId": 3,
  "massageId": 5,
  "couponCode": "SAVE10",
  "amount": 1260,
  "city": "Mumbai"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "transaction": {
    "trans_id": 1,
    "custid": 3,
    "massid": 5,
    "datetrans": "2026-04-22T10:45:00Z",
    "coupon_code": "SAVE10",
    "amount": 1260
  }
}
```

---

## 👨‍💼 Admin APIs

### 14. Add New Massage (Admin Only)

**Endpoint:** `POST /api/admin/massages`

**Headers:**
```
Authorization: Bearer admin-token-special
X-Admin-Key: admin-token-special
```

**Request Body:**
```json
{
  "massagename": "Aromatherapy Session",
  "massagetype": "Upper Body",
  "duration": 60,
  "price": 1500,
  "massagezone": "Mumbai",
  "Description": "Relaxing aromatherapy with essential oils"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "massage": {
    "id": 21,
    "massagename": "Aromatherapy Session",
    "massagetype": "Upper Body",
    "duration": 60,
    "price": 1500,
    "massagezone": "Mumbai",
    "Description": "Relaxing aromatherapy with essential oils"
  }
}
```

**Response (Error - 403):**
```json
{
  "error": "Admin access required"
}
```

---

### 15. Update Massage (Admin Only)

**Endpoint:** `PUT /api/admin/massages/{id}`

**Headers:**
```
Authorization: Bearer admin-token-special
X-Admin-Key: admin-token-special
```

**Request Body:**
```json
{
  "massagename": "Aromatherapy Deluxe",
  "massagetype": "Upper Body",
  "duration": 75,
  "price": 1800,
  "massagezone": "Mumbai",
  "Description": "Premium aromatherapy with essential oils"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "massage": {
    "id": 21,
    "massagename": "Aromatherapy Deluxe",
    "massagetype": "Upper Body",
    "duration": 75,
    "price": 1800,
    "massagezone": "Mumbai",
    "Description": "Premium aromatherapy with essential oils"
  }
}
```

---

### 16. Delete Massage (Admin Only)

**Endpoint:** `DELETE /api/admin/massages/{id}`

**Headers:**
```
Authorization: Bearer admin-token-special
X-Admin-Key: admin-token-special
```

**Response (Success - 200):**
```json
{
  "success": true
}
```

---

### 17. Get All Bookings (Admin Only)

**Endpoint:** `GET /api/admin/bookings`

**Headers:**
```
Authorization: Bearer admin-token-special
X-Admin-Key: admin-token-special
```

**Response (Success - 200):**
```json
{
  "bookings": [
    {
      "trans_id": 1,
      "custid": 3,
      "massid": 5,
      "datetrans": "2026-04-22T10:45:00Z",
      "coupon_code": "SAVE10",
      "amount": 1260,
      "customer_name": "John Doe",
      "massage_name": "Thai Torso Massage"
    }
  ]
}
```

---

## 📈 Reports

### 18. MIS Report (Bookings by Date Range)

**Endpoint:** `POST /api/mis-report`

**Request Body:**
```json
{
  "startDate": "2026-04-01",
  "endDate": "2026-04-30"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "bookings": [
    {
      "trans_id": 1,
      "booking_date": "2026-04-22",
      "booking_time": "10:45 AM",
      "customer_name": "John Doe",
      "customer_email": "john@example.com",
      "customer_phone": "9876543210",
      "massage_name": "Thai Torso Massage",
      "massage_type": "Torso",
      "city": "Mumbai",
      "massage_price": 1400
    },
    {
      "trans_id": 2,
      "booking_date": "2026-04-20",
      "booking_time": "02:30 PM",
      "customer_name": "Jane Smith",
      "customer_email": "jane@example.com",
      "customer_phone": "9876543211",
      "massage_name": "Hot Stone Back",
      "massage_type": "Torso",
      "city": "Delhi",
      "massage_price": 1800
    }
  ],
  "count": 2
}
```

---

## 🔒 Authentication Notes

### Token Format

For regular users:
```
user-{userId}-{timestamp}
```
Example: `user-3-1713779400000`

For admin:
```
admin-token-special
```

### Authorization Headers

The frontend sends tokens in two ways:

1. **Standard Bearer Token:**
   ```
   Authorization: Bearer {token}
   ```

2. **Custom Token Header (for user tokens):**
   ```
   X-User-Token: {token}
   ```

3. **Admin Key Header:**
   ```
   X-Admin-Key: admin-token-special
   ```

Your Spring Boot backend should check both `Authorization` and `X-User-Token` headers.

---

## 🗄️ Database Relationships

```
customer_master (1) ----< (many) cart_master
customer_master (1) ----< (many) cust_mass_trans
customer_master (1) ----< (many) customer_payments

massage_master (1) ----< (many) cart_master
massage_master (1) ----< (many) cust_mass_trans
```

---

## ⚙️ CORS Configuration

Your Spring Boot backend **must** enable CORS:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "https://your-frontend.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

---

## 🚨 Error Handling

All error responses should follow this format:

```json
{
  "error": "Error message here",
  "code": 400,
  "details": "Additional details if needed"
}
```

Common HTTP Status Codes:
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (admin access required)
- `404` - Not Found
- `500` - Internal Server Error

---

## 📝 Sample Initial Data

Your backend should seed the database with these massage services:

**Mumbai - Lower Body:**
- Thai Leg Massage (60 min, ₹1200)
- Foot Reflexology (45 min, ₹800)
- Deep Tissue Leg (75 min, ₹1500)

**Mumbai - Torso:**
- Thai Torso Massage (60 min, ₹1400)
- Hot Stone Back (75 min, ₹1800)
- Aromatherapy Torso (60 min, ₹1600)

**Mumbai - Upper Body:**
- Neck & Shoulder Relief (45 min, ₹1000)
- Thai Head Massage (30 min, ₹900)
- Arm & Hand Therapy (45 min, ₹800)
- Upper Body Complete (75 min, ₹1700)

*(Same services for Delhi)*

---

## ✅ Implementation Checklist

- [ ] Set up Spring Boot project with Maven/Gradle
- [ ] Configure MySQL/PostgreSQL database
- [ ] Create entity classes for all tables
- [ ] Implement JWT authentication
- [ ] Create repository interfaces
- [ ] Implement service layer
- [ ] Create REST controllers for all endpoints
- [ ] Add CORS configuration
- [ ] Add error handling and validation
- [ ] Test all endpoints with Postman
- [ ] Deploy backend (Heroku/Railway/AWS)

---

Good luck building your Spring Boot backend! 🚀
