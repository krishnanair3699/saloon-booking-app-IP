# Frontend Integration Guide

## Connecting React Frontend to Java Backend

This guide shows you exactly which frontend files need to be updated to use the Java backend instead of Supabase Edge Functions.

---

## Quick Setup Steps

### 1. Start Java Backend

```bash
cd java-backend
mvn spring-boot:run
```

Server runs on: **http://localhost:8080/api**

### 2. Update Frontend API Base URL

Create a new file to centralize the API URL:

**File**: `/src/app/utils/api-config.ts`
```typescript
// Configuration for API endpoints
export const API_BASE_URL = 'http://localhost:8080/api';

// Helper function for API calls
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  return response.json();
}
```

---

## Files That Need Updates

### ✅ Authentication Files

#### 1. `/src/app/contexts/AuthContext.tsx`

**Current**: Uses Supabase auth  
**Change**: Call Java backend `/auth/signup` and `/auth/login`

**Find this section** (around line 50-80):
```typescript
// OLD CODE (Supabase)
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

**Replace with**:
```typescript
// NEW CODE (Java Backend)
import { apiCall } from '../utils/api-config';

const signIn = async (email: string, password: string) => {
  const data = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  if (!data.token) {
    throw new Error(data.error || 'Login failed');
  }
  
  // Store user info
  const userData = {
    email: data.email,
    customerId: data.customerId,
    name: data.name,
    isAdmin: data.isAdmin,
  };
  
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('token', data.token);
  setUser(userData);
};
```

**For Signup** (around line 90-120):
```typescript
// NEW CODE (Java Backend)
const signUp = async (name: string, email: string, password: string, phone: string) => {
  const data = await apiCall('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, phone }),
  });
  
  if (!data.token) {
    throw new Error(data.error || 'Signup failed');
  }
  
  // Auto login after signup
  const userData = {
    email: data.email,
    customerId: data.customerId,
    name: data.name,
    isAdmin: data.isAdmin,
  };
  
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('token', data.token);
  setUser(userData);
};
```

---

### ✅ Massage/Services Files

#### 2. `/src/app/pages/Services.tsx`

**Find the fetch call** (around line 80-100):
```typescript
// OLD CODE
const response = await fetch(
  `https://${projectId}.supabase.co/functions/v1/make-server-86f09702/massages?...`
);
```

**Replace with**:
```typescript
// NEW CODE
import { API_BASE_URL } from '../utils/api-config';

const response = await fetch(
  `${API_BASE_URL}/massages?massageType=${encodeURIComponent(massageType)}&city=${encodeURIComponent(city)}`,
  {
    headers: {
      'Content-Type': 'application/json',
    },
  }
);
```

---

### ✅ Cart/Booking Files

#### 3. Cart operations in BookingContext or Booking pages

**OLD**:
```typescript
const response = await fetch(
  `https://${projectId}.supabase.co/functions/v1/make-server-86f09702/cart`,
  { method: 'POST', ... }
);
```

**NEW**:
```typescript
import { apiCall } from '../utils/api-config';

const response = await apiCall('/bookings/cart', {
  method: 'POST',
  body: JSON.stringify({
    customerId: user.customerId,
    massageId: massage.massageId,
    bookingDate: selectedDate,
    bookingTime: selectedTime,
  }),
});
```

---

### ✅ Payment Files

#### 4. `/src/app/pages/PaymentGateway.tsx`

**Find payment processing call** (around line 150-200):
```typescript
// OLD CODE
const response = await fetch(
  `https://${projectId}.supabase.co/functions/v1/make-server-86f09702/payment/process`,
  { ... }
);
```

**Replace with**:
```typescript
// NEW CODE
import { apiCall } from '../utils/api-config';

const response = await apiCall('/payments/process', {
  method: 'POST',
  body: JSON.stringify({
    customerId: user.customerId,
    massageId: selectedMassage.massageId,
    paymentMethod: paymentMethod,
    paymentDetails: getPaymentDetails(),
    amount: finalAmount,
    couponCode: appliedCoupon,
  }),
});
```

**For coupon validation**:
```typescript
// NEW CODE
const response = await apiCall('/payments/validate-coupon', {
  method: 'POST',
  body: JSON.stringify({
    couponCode: code,
    customerId: user.customerId,
    amount: totalAmount,
  }),
});
```

---

### ✅ Admin Dashboard Files

#### 5. `/src/app/components/admin/TherapyMassageMaster.tsx`

**For fetching massages**:
```typescript
// NEW CODE
import { API_BASE_URL } from '../../utils/api-config';

const response = await fetch(`${API_BASE_URL}/massages`);
const data = await response.json();
setMassages(data);
```

**For creating massage**:
```typescript
// NEW CODE
const response = await fetch(`${API_BASE_URL}/massages`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(massageData),
});
```

**For updating massage**:
```typescript
// NEW CODE
const response = await fetch(`${API_BASE_URL}/massages/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(massageData),
});
```

**For deleting massage**:
```typescript
// NEW CODE
const response = await fetch(`${API_BASE_URL}/massages/${id}`, {
  method: 'DELETE',
});
```

---

#### 6. `/src/app/components/admin/MISReport.tsx`

**Find MIS report fetch** (around line 40-60):
```typescript
// OLD CODE
const response = await fetch(
  `https://${projectId}.supabase.co/functions/v1/make-server-86f09702/mis-report`,
  { ... }
);
```

**Replace with**:
```typescript
// NEW CODE
import { apiCall } from '../../utils/api-config';

const data = await apiCall('/reports/mis', {
  method: 'POST',
  body: JSON.stringify({
    startDate,
    endDate,
  }),
});

setBookings(data.bookings || []);
```

---

## Summary of Changes

| File | What to Change | New Endpoint |
|------|----------------|--------------|
| `AuthContext.tsx` | Login/Signup | `/auth/login`, `/auth/signup` |
| `Services.tsx` | Fetch massages | `/massages?massageType=...&city=...` |
| `BookingContext.tsx` | Cart operations | `/bookings/cart` |
| `PaymentGateway.tsx` | Payment & coupon | `/payments/process`, `/payments/validate-coupon` |
| `TherapyMassageMaster.tsx` | CRUD operations | `/massages`, `/massages/{id}` |
| `MISReport.tsx` | Generate report | `/reports/mis` |

---

## Testing Checklist

After making changes, test these flows:

✅ **Signup**: Create new account  
✅ **Login**: Sign in with existing account  
✅ **Browse Services**: View massages by city and type  
✅ **Add to Cart**: Add massage to cart  
✅ **Apply Coupon**: Test "FIRSTTIME15" coupon  
✅ **Complete Payment**: Process payment and create transaction  
✅ **Admin Dashboard**: View/edit massages  
✅ **MIS Report**: Generate date range report  

---

## Important Notes

### CORS Configuration
The Java backend is already configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `https://app-*.figma.site` (Figma Make)

### Authentication Headers
For protected endpoints (not currently implemented in simplified version), add:
```typescript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
}
```

### Error Handling
Java backend returns errors in this format:
```json
{
  "error": "Error message here"
}
```

Update error handling in frontend accordingly.

---

## Quick Reference: API Endpoints

### Public Endpoints (No Auth Required)
```
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/massages
GET    /api/massages/{id}
```

### Protected Endpoints (User Auth)
```
POST   /api/bookings/cart
GET    /api/bookings/cart/{customerId}
DELETE /api/bookings/cart/{cartId}
POST   /api/payments/process
POST   /api/payments/validate-coupon
```

### Admin Endpoints
```
POST   /api/massages
PUT    /api/massages/{id}
DELETE /api/massages/{id}
POST   /api/reports/mis
```

---

## Next Steps

1. ✅ Create `/src/app/utils/api-config.ts`
2. ✅ Update each file listed above
3. ✅ Start Java backend (`mvn spring-boot:run`)
4. ✅ Test each feature
5. ✅ Show your teacher the complete Java implementation!

---

**Your UI will look exactly the same!** Only the backend technology changes. 🎯
