# SAVADHIKA Database Schema

## Required Supabase Tables

Please create these tables in your Supabase dashboard (SQL Editor):

### 1. massage_master
```sql
CREATE TABLE massage_master (
  id SERIAL PRIMARY KEY,
  massagename TEXT NOT NULL,
  massagetype TEXT NOT NULL,
  duration INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  massagezone TEXT NOT NULL,
  Description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. customer_master
```sql
CREATE TABLE customer_master (
  id SERIAL PRIMARY KEY,
  customername TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  "mobile no" TEXT NOT NULL,
  city TEXT,
  password TEXT NOT NULL,
  confirmpassword TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. cart_master
```sql
CREATE TABLE cart_master (
  id SERIAL PRIMARY KEY,
  customerid INTEGER NOT NULL,
  massageid INTEGER NOT NULL,
  transactiondate TIMESTAMP WITH TIME ZONE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. cust_mass_trans
```sql
CREATE TABLE cust_mass_trans (
  id SERIAL PRIMARY KEY,
  custid INTEGER NOT NULL,
  massid INTEGER NOT NULL,
  datetrans TIMESTAMP WITH TIME ZONE,
  coupon_code TEXT,
  amount NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. customer_payments
```sql
CREATE TABLE customer_payments (
  id SERIAL PRIMARY KEY,
  customerid INTEGER NOT NULL,
  paymentdetails TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. coupon_master
```sql
CREATE TABLE coupon_master (
  id SERIAL PRIMARY KEY,
  coupon_code TEXT UNIQUE NOT NULL,
  discount_percentage INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default coupon
INSERT INTO coupon_master (coupon_code, discount_percentage, is_active)
VALUES ('FIRSTTIME15', 15, TRUE);
```

## Instructions

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run each CREATE TABLE statement above
4. After creating all tables, refresh the SAVADHIKA app
5. The app will automatically populate the massage_master table with initial data

## Notes

- All tables use SERIAL for auto-incrementing IDs
- Timestamps are automatically set using DEFAULT NOW()
- The massage_master table will be populated automatically by the app on first load
- Make sure to disable RLS (Row Level Security) for testing, or configure appropriate policies
