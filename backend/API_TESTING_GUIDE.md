# API Testing Guide - SAVADHIKA Backend

## 🧪 Complete Testing Workflow

This guide will walk you through testing every API endpoint step-by-step.

---

## Prerequisites

1. **Java Backend Running**: `mvn spring-boot:run`
2. **Base URL**: `http://localhost:8080/api`
3. **Tool**: Use Postman, curl, or browser

---

## Test Sequence (Follow This Order)

### 1️⃣ Test Signup (Create Customer Account)

**Endpoint**: `POST /api/auth/signup`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123"
}
```

**curl Command**:
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "password123"
  }'
```

**Expected Response**:
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

**✅ Success Criteria**:
- HTTP Status: 200 OK
- Returns JWT token
- customerId is assigned
- Password is NOT in response

**📝 Save This**: Copy the `customerId` - you'll need it for other tests!

---

### 2️⃣ Test Login

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**curl Command**:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response**:
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

**✅ Success Criteria**:
- Same customer data as signup
- New JWT token generated
- Password verification works

**Test Wrong Password**:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "wrongpassword"
  }'
```

Expected: Error message "Invalid email or password"

---

### 3️⃣ Test Get All Massages

**Endpoint**: `GET /api/massages`

**curl Command**:
```bash
curl http://localhost:8080/api/massages
```

**Expected Response**:
```json
[
  {
    "massageId": 1,
    "massageName": "Traditional Thai Massage",
    "massageDescription": "...",
    "massageType": "Full Body",
    "massagePrice": 2500.0,
    "massageDuration": 90,
    "massageZone": "Mumbai",
    "createdAt": "2026-03-21T10:00:00"
  },
  ...
]
```

**✅ Success Criteria**:
- Returns array of massages (may be empty initially)
- Each massage has all required fields

---

### 4️⃣ Test Get Massages by Filter

**By City**:
```bash
curl "http://localhost:8080/api/massages?city=Mumbai"
```

**By Type**:
```bash
curl "http://localhost:8080/api/massages?massageType=Head%20%26%20Shoulders"
```

**By Both**:
```bash
curl "http://localhost:8080/api/massages?massageType=Full%20Body&city=Delhi"
```

**✅ Success Criteria**:
- Returns only massages matching filters
- Empty array if no matches

---

### 5️⃣ Test Create Massage (Admin)

**Endpoint**: `POST /api/massages`

**Request Body**:
```json
{
  "massageName": "Relaxing Head Massage",
  "massageDescription": "A soothing massage for head and shoulders to relieve stress",
  "massageType": "Head & Shoulders",
  "massagePrice": 800.0,
  "massageDuration": 30,
  "massageZone": "Mumbai"
}
```

**curl Command**:
```bash
curl -X POST http://localhost:8080/api/massages \
  -H "Content-Type: application/json" \
  -d '{
    "massageName": "Relaxing Head Massage",
    "massageDescription": "A soothing massage for head and shoulders",
    "massageType": "Head & Shoulders",
    "massagePrice": 800.0,
    "massageDuration": 30,
    "massageZone": "Mumbai"
  }'
```

**Expected Response**:
```json
{
  "massageId": 5,
  "massageName": "Relaxing Head Massage",
  "massageDescription": "A soothing massage for head and shoulders",
  "massageType": "Head & Shoulders",
  "massagePrice": 800.0,
  "massageDuration": 30,
  "massageZone": "Mumbai",
  "createdAt": "2026-03-21T11:30:00"
}
```

**📝 Save This**: Copy the `massageId` for next tests!

---

### 6️⃣ Test Add to Cart

**Endpoint**: `POST /api/bookings/cart`

**Request Body**:
```json
{
  "customerId": 1,
  "massageId": 5,
  "bookingDate": "2026-03-25",
  "bookingTime": "14:00"
}
```

**curl Command**:
```bash
curl -X POST http://localhost:8080/api/bookings/cart \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "massageId": 5,
    "bookingDate": "2026-03-25",
    "bookingTime": "14:00"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "cartItem": {
    "cartId": 1,
    "customerId": 1,
    "massageId": 5,
    "bookingDate": "2026-03-25",
    "bookingTime": "14:00",
    "createdAt": "2026-03-21T11:35:00"
  },
  "message": "Added to cart successfully"
}
```

**📝 Save This**: Copy the `cartId`

---

### 7️⃣ Test Get Cart Items

**Endpoint**: `GET /api/bookings/cart/{customerId}`

**curl Command**:
```bash
curl http://localhost:8080/api/bookings/cart/1
```

**Expected Response**:
```json
{
  "success": true,
  "cartItems": [
    {
      "cartId": 1,
      "bookingDate": "2026-03-25",
      "bookingTime": "14:00",
      "massageId": 5,
      "massageName": "Relaxing Head Massage",
      "massageType": "Head & Shoulders",
      "massagePrice": 800.0,
      "massageDuration": 30,
      "massageZone": "Mumbai"
    }
  ]
}
```

**✅ Success Criteria**:
- Shows cart items with full massage details
- Prices are correct

---

### 8️⃣ Test Validate Coupon

**Endpoint**: `POST /api/payments/validate-coupon`

**Request Body**:
```json
{
  "couponCode": "FIRSTTIME15",
  "customerId": 1,
  "amount": 2000.0
}
```

**curl Command**:
```bash
curl -X POST http://localhost:8080/api/payments/validate-coupon \
  -H "Content-Type: application/json" \
  -d '{
    "couponCode": "FIRSTTIME15",
    "customerId": 1,
    "amount": 2000.0
  }'
```

**Expected Response (If Coupon Exists)**:
```json
{
  "valid": true,
  "message": "Coupon applied successfully!",
  "discountPercentage": 15.0,
  "discountAmount": 300.0,
  "finalAmount": 1700.0
}
```

**Expected Response (If Coupon Doesn't Exist)**:
```json
{
  "valid": false,
  "message": "Invalid coupon code",
  "discountPercentage": null,
  "discountAmount": null,
  "finalAmount": null
}
```

**Note**: If coupon doesn't exist in your database, it will return invalid. That's normal!

---

### 9️⃣ Test Process Payment

**Endpoint**: `POST /api/payments/process`

**Request Body (With Coupon)**:
```json
{
  "customerId": 1,
  "massageId": 5,
  "paymentMethod": "Credit Card",
  "paymentDetails": "Visa ending in 1234",
  "amount": 800.0,
  "couponCode": "FIRSTTIME15"
}
```

**curl Command**:
```bash
curl -X POST http://localhost:8080/api/payments/process \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "massageId": 5,
    "paymentMethod": "Credit Card",
    "paymentDetails": "Visa ending in 1234",
    "amount": 800.0,
    "couponCode": "FIRSTTIME15"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "transactionId": 1,
  "paymentId": 1,
  "amount": 680.0,
  "discountAmount": 120.0,
  "message": "Payment processed successfully"
}
```

**✅ Success Criteria**:
- Transaction created
- Payment recorded
- Discount applied (if coupon valid)
- Cart should be cleared after this

**Test Without Coupon**:
```bash
curl -X POST http://localhost:8080/api/payments/process \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "massageId": 5,
    "paymentMethod": "UPI",
    "paymentDetails": "GooglePay",
    "amount": 800.0
  }'
```

---

### 🔟 Test Verify Cart Cleared

**curl Command**:
```bash
curl http://localhost:8080/api/bookings/cart/1
```

**Expected Response**:
```json
{
  "success": true,
  "cartItems": []
}
```

**✅ Success Criteria**: Cart is empty after payment

---

### 1️⃣1️⃣ Test Generate MIS Report

**Endpoint**: `POST /api/reports/mis`

**Request Body**:
```json
{
  "startDate": "2026-03-01",
  "endDate": "2026-03-31"
}
```

**curl Command**:
```bash
curl -X POST http://localhost:8080/api/reports/mis \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2026-03-01",
    "endDate": "2026-03-31"
  }'
```

**Expected Response**:
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
      "massage_price": 680.0,
      "booking_time": "14:00"
    }
  ],
  "totalBookings": 1,
  "totalRevenue": 680.0
}
```

**✅ Success Criteria**:
- Shows all bookings in date range
- Correct totals calculated
- Customer and massage details joined

---

### 1️⃣2️⃣ Test Booking History

**Endpoint**: `GET /api/reports/booking-history/{customerId}`

**curl Command**:
```bash
curl http://localhost:8080/api/reports/booking-history/1
```

**Expected Response**:
```json
{
  "success": true,
  "bookings": [
    {
      "trans_id": 1,
      "datetrans": "2026-03-21T11:40:00",
      "massname": "Relaxing Head Massage",
      "masstype": "Head & Shoulders",
      "masszone": "Mumbai",
      "amount": 680.0,
      "coupon_code": "FIRSTTIME15",
      "payment_method": "Credit Card"
    }
  ]
}
```

---

## 🎯 Complete Test Checklist

### Authentication
- [ ] Signup with valid data → Returns token and customerId
- [ ] Signup with duplicate email → Returns error
- [ ] Login with correct password → Returns token
- [ ] Login with wrong password → Returns error

### Massages
- [ ] Get all massages → Returns array
- [ ] Get massages by city → Filtered correctly
- [ ] Get massages by type → Filtered correctly
- [ ] Create massage → Returns created massage with ID
- [ ] Get massage by ID → Returns correct massage

### Booking/Cart
- [ ] Add to cart → Success message
- [ ] Get cart items → Shows items with massage details
- [ ] Cart count updates → Correct count
- [ ] Remove from cart → Item removed
- [ ] Clear cart → All items removed

### Payments
- [ ] Validate valid coupon → Returns discount details
- [ ] Validate invalid coupon → Returns error
- [ ] Validate already used coupon → Returns error
- [ ] Process payment without coupon → Transaction created
- [ ] Process payment with coupon → Discount applied
- [ ] Cart cleared after payment → Cart is empty

### Reports
- [ ] Generate MIS report → Returns bookings with totals
- [ ] Booking history → Shows customer's bookings
- [ ] Date range filtering → Only shows bookings in range

---

## 🐛 Common Issues & Solutions

### Issue 1: "Connection refused"
**Solution**: Backend is not running. Start it with `mvn spring-boot:run`

### Issue 2: "Table doesn't exist"
**Solution**: Tables not created in Supabase. Check your database.

### Issue 3: "Invalid coupon code"
**Solution**: Coupon doesn't exist in database. Either:
- Skip coupon testing, OR
- Insert coupon manually in Supabase:
```sql
INSERT INTO coupon_master (coupon_code, discount_percentage, max_discount_amount, is_active)
VALUES ('FIRSTTIME15', 15, 500, true);
```

### Issue 4: "404 Not Found"
**Solution**: Check URL. Should be `http://localhost:8080/api/...` not `http://localhost:8080/...`

### Issue 5: "500 Internal Server Error"
**Solution**: Check backend console logs for detailed error message.

---

## 📊 Postman Collection

If using Postman, create a collection with these requests:

**1. Create Environment Variables**:
- `baseUrl`: `http://localhost:8080/api`
- `customerId`: (save from signup response)
- `massageId`: (save from create massage response)
- `token`: (save from login response)

**2. Use Variables in Requests**:
```
{{baseUrl}}/auth/signup
{{baseUrl}}/massages?city=Mumbai
{{baseUrl}}/bookings/cart/{{customerId}}
```

---

## 🎓 For Your Teacher Demo

**Recommended Flow**:

1. **Start Backend**: Show console output
2. **Signup**: Create account, show JWT token
3. **Login**: Authenticate, get new token
4. **Create Massage**: Add service to database
5. **Browse Massages**: Filter by city and type
6. **Add to Cart**: Select massage with date/time
7. **Validate Coupon**: Show discount calculation
8. **Process Payment**: Complete transaction
9. **Generate Report**: Show MIS report with data
10. **Explain Code**: Walk through Service layer logic

**Key Points to Emphasize**:
- Password is hashed (BCrypt)
- JWT token authentication
- Transaction management (@Transactional)
- Business logic in Service layer
- Clean separation of concerns

---

## 🚀 Quick Test Script

Run all tests at once:

```bash
#!/bin/bash

BASE_URL="http://localhost:8080/api"

echo "1. Testing Signup..."
curl -X POST $BASE_URL/auth/signup -H "Content-Type: application/json" -d '{"name":"Test User","email":"test@example.com","phone":"9876543210","password":"test123"}'

echo "\n\n2. Testing Login..."
curl -X POST $BASE_URL/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"test123"}'

echo "\n\n3. Testing Get Massages..."
curl $BASE_URL/massages

echo "\n\n4. Testing Add to Cart..."
curl -X POST $BASE_URL/bookings/cart -H "Content-Type: application/json" -d '{"customerId":1,"massageId":1,"bookingDate":"2026-03-25","bookingTime":"14:00"}'

echo "\n\nTests Complete!"
```

Save as `test-api.sh` and run: `bash test-api.sh`

---

**Happy Testing! 🎉**
