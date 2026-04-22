import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Supabase client for auth
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Admin-Key", "X-User-Token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-86f09702/health", (c) => {
  return c.json({ status: "ok" });
});

// Debug endpoint to see what headers we receive
app.all("/make-server-86f09702/debug-headers", (c) => {
  const headers: Record<string, string> = {};
  c.req.raw.headers.forEach((value, key) => {
    headers[key] = value;
  });
  
  return c.json({
    method: c.req.method,
    url: c.req.url,
    headers: headers,
    hasAuthorization: !!c.req.header('Authorization'),
    authorizationValue: c.req.header('Authorization'),
    hasXAdminKey: !!c.req.header('X-Admin-Key'),
    xAdminKeyValue: c.req.header('X-Admin-Key')
  });
});

// Test token validation endpoint
app.post("/make-server-86f09702/test-token", async (c) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  
  console.log('=== TEST TOKEN ENDPOINT ===');
  console.log('Raw Authorization header:', c.req.header('Authorization'));
  console.log('Extracted token:', accessToken);
  
  const { userId, error: authError } = await getUserIdFromToken(accessToken);
  
  return c.json({
    success: !!userId && !authError,
    userId: userId,
    error: authError,
    tokenReceived: accessToken,
    tokenFormat: accessToken?.startsWith('user-') ? 'custom' : accessToken === 'admin-token-special' ? 'admin' : 'unknown'
  });
});

// Test database connection
app.get("/make-server-86f09702/test-db", async (c) => {
  try {
    console.log('Testing database connection...');
    console.log('SUPABASE_URL:', Deno.env.get('SUPABASE_URL'));
    console.log('SERVICE_ROLE_KEY present:', !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
    
    // Try to query the massage_master table
    const { data, error, count } = await supabase
      .from('massage_master')
      .select('*', { count: 'exact' })
      .limit(5);
    
    if (error) {
      console.log('Database error:', error);
      return c.json({ 
        success: false, 
        error: error.message,
        details: error,
        hint: error.hint,
        code: error.code
      });
    }
    
    return c.json({ 
      success: true, 
      message: 'Database connection successful',
      rowCount: count,
      sampleData: data
    });
  } catch (error) {
    console.log('Test DB exception:', error);
    return c.json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Test insert into massage_master table
app.post("/make-server-86f09702/test-insert", async (c) => {
  try {
    console.log('Testing insert into massage_master...');
    
    const testData = {
      massagename: 'Test Massage',
      massagetype: 'Torso',
      duration: 60,
      price: 1000,
      massagezone: 'Test Zone',
      Description: 'Test Description'
    };
    
    console.log('Attempting to insert:', testData);
    
    const { data, error } = await supabase
      .from('massage_master')
      .insert([testData])
      .select()
      .single();
    
    if (error) {
      console.log('Insert error:', error);
      return c.json({ 
        success: false, 
        error: error.message,
        details: error,
        hint: error.hint,
        code: error.code,
        insertedData: testData
      });
    }
    
    console.log('Insert successful:', data);
    
    return c.json({ 
      success: true, 
      message: 'Insert successful',
      data: data
    });
  } catch (error) {
    console.log('Test insert exception:', error);
    return c.json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ==================== AUTHENTICATION ROUTES ====================

// Sign Up
app.post("/make-server-86f09702/auth/signup", async (c) => {
  try {
    const { email, password, name, phone, city } = await c.req.json();

    if (!email || !password || !name || !phone) {
      return c.json({ error: "Email, password, name, and phone are required" }, 400);
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, phone, city },
      // Automatically confirm email since email server hasn't been configured
      email_confirm: true
    });

    if (authError) {
      console.log(`Sign up error: ${authError.message}`);
      return c.json({ error: authError.message }, 400);
    }

    const userId = authData.user.id;

    console.log('=== ATTEMPTING TO INSERT INTO CUSTOMER_MASTER ===');
    console.log('User ID:', userId);
    console.log('Data to insert:', { email, customername: name, 'mobile no': phone, city, password: '***' });

    // Store user profile in customer_master table
    const { data: customerData, error: customerError } = await supabase
      .from('customer_master')
      .insert([{
        customername: name,
        email,
        'mobile no': phone,
        city,
        password: password, // Storing password (Note: Supabase Auth already handles secure password storage)
        confirmpassword: password // Storing same as password
      }])
      .select()
      .single();

    if (customerError) {
      console.log('=== CUSTOMER_MASTER INSERT ERROR ===');
      console.log('Error message:', customerError.message);
      console.log('Error code:', customerError.code);
      console.log('Error details:', customerError.details);
      console.log('Error hint:', customerError.hint);
      console.log('Full error object:', JSON.stringify(customerError, null, 2));
      
      return c.json({ 
        error: `Failed to create customer profile: ${customerError.message}`,
        errorCode: customerError.code,
        errorDetails: customerError.details,
        errorHint: customerError.hint
      }, 500);
    }

    console.log('=== SUCCESS: Customer created in customer_master ===');
    console.log('Customer data:', customerData);

    return c.json({
      success: true,
      user: {
        id: userId,
        email,
        name,
        phone,
        city
      }
    });
  } catch (error) {
    console.log(`Sign up exception: ${error.message}`);
    return c.json({ error: "Failed to create account" }, 500);
  }
});

// Sign In
app.post("/make-server-86f09702/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();

    // Check for admin credentials - accept both 'admin' and 'admin@admin' and 'admin@admin.com'
    if ((email === 'admin' || email === 'admin@admin' || email === 'admin@admin.com') && 
        (password === 'admin' || password === 'Admin')) {
      return c.json({
        success: true,
        access_token: 'admin-token-special',
        user: {
          id: 'admin',
          email: 'admin@admin.com',
          name: 'Administrator',
          phone: 'N/A',
          is_admin: true
        }
      });
    }

    console.log('=== ATTEMPTING SIGN IN ===');
    console.log('Email:', email);

    // Check credentials in customer_master table
    const { data: customer, error: customerError } = await supabase
      .from('customer_master')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (customerError || !customer) {
      console.log('Sign in error - customer not found or password mismatch');
      console.log('Error:', customerError);
      return c.json({ error: "Invalid email or password" }, 401);
    }

    console.log('=== SIGN IN SUCCESS ===');
    console.log('Customer found:', customer.customername);

    // Generate a simple token (in production, use JWT)
    const access_token = `user-${customer.id}-${Date.now()}`;

    return c.json({
      success: true,
      access_token: access_token,
      user: {
        id: customer.id,
        email: customer.email,
        name: customer.customername,
        phone: customer['mobile no'],
        city: customer.city
      }
    });
  } catch (error) {
    console.log(`Sign in exception: ${error.message}`);
    return c.json({ error: "Failed to sign in" }, 500);
  }
});

// Get Current User
app.get("/make-server-86f09702/auth/me", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get user profile from KV store
    const userProfile = await kv.get(`user:${user.id}`);

    return c.json({
      user: userProfile || {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
        phone: user.user_metadata?.phone
      }
    });
  } catch (error) {
    console.log(`Get user error: ${error.message}`);
    return c.json({ error: "Failed to get user" }, 500);
  }
});

// ==================== MASSAGE MASTER ROUTES ====================

// Get all massages (optionally filtered by body area)
app.get("/make-server-86f09702/massages", async (c) => {
  try {
    // This endpoint is public but also accepts admin token
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    // Log for debugging
    console.log('GET /massages - Access token:', accessToken ? 'Present' : 'Missing');
    console.log('SUPABASE_URL:', Deno.env.get('SUPABASE_URL'));
    console.log('SERVICE_ROLE_KEY present:', !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
    
    // Fetch from massage_master table using service role (bypasses RLS)
    const { data: massages, error } = await supabase
      .from('massage_master')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.log(`Get massages error: ${error.message}`);
      console.log('Error code:', error.code);
      console.log('Error details:', error.details);
      console.log('Error hint:', error.hint);
      console.log('Full error:', JSON.stringify(error));
      
      // Return 200 with empty array if table doesn't exist yet
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        console.log('Table does not exist, returning empty array');
        return c.json({ massages: [], message: 'Table not created yet' });
      }
      
      return c.json({ error: `Failed to fetch massages: ${error.message}`, details: error }, 500);
    }

    console.log(`Successfully fetched ${massages?.length || 0} massages`);
    return c.json({ massages: massages || [] });
  } catch (error) {
    console.log(`Get massages exception: ${error.message}`);
    console.log('Full exception:', error);
    return c.json({ error: `Failed to fetch massages: ${error.message}` }, 500);
  }
});

// Initialize massage master data (run once to populate database)
app.post("/make-server-86f09702/massages/initialize", async (c) => {
  try {
    console.log('=== INITIALIZE MASSAGES ENDPOINT ===');
    
    const massages = [
      // Lower Body - Mumbai
      { massagename: 'Thai Leg Massage', massagetype: 'Lower Body', duration: 60, price: 1200, massagezone: 'Mumbai', Description: 'Traditional Thai techniques for lower body relief' },
      { massagename: 'Foot Reflexology', massagetype: 'Lower Body', duration: 45, price: 800, massagezone: 'Mumbai', Description: 'Pressure point therapy for complete relaxation' },
      { massagename: 'Deep Tissue Leg', massagetype: 'Lower Body', duration: 75, price: 1500, massagezone: 'Mumbai', Description: 'Intensive deep tissue work for athletes' },
      
      // Torso - Mumbai
      { massagename: 'Thai Torso Massage', massagetype: 'Torso', duration: 60, price: 1400, massagezone: 'Mumbai', Description: 'Core balancing and spinal alignment' },
      { massagename: 'Hot Stone Back', massagetype: 'Torso', duration: 75, price: 1800, massagezone: 'Mumbai', Description: 'Heated basalt stones for deep muscle relaxation' },
      { massagename: 'Aromatherapy Torso', massagetype: 'Torso', duration: 60, price: 1600, massagezone: 'Mumbai', Description: 'Essential oils with gentle massage strokes' },
      
      // Upper Body - Mumbai
      { massagename: 'Neck & Shoulder Relief', massagetype: 'Upper Body', duration: 45, price: 1000, massagezone: 'Mumbai', Description: 'Perfect for desk workers and tension relief' },
      { massagename: 'Thai Head Massage', massagetype: 'Upper Body', duration: 30, price: 900, massagezone: 'Mumbai', Description: 'Scalp stimulation and facial acupressure' },
      { massagename: 'Arm & Hand Therapy', massagetype: 'Upper Body', duration: 45, price: 800, massagezone: 'Mumbai', Description: 'Circulation boost and joint mobility' },
      { massagename: 'Upper Body Complete', massagetype: 'Upper Body', duration: 75, price: 1700, massagezone: 'Mumbai', Description: 'Comprehensive upper body wellness session' },
      
      // Lower Body - Delhi
      { massagename: 'Thai Leg Massage', massagetype: 'Lower Body', duration: 60, price: 1200, massagezone: 'Delhi', Description: 'Traditional Thai techniques for lower body relief' },
      { massagename: 'Foot Reflexology', massagetype: 'Lower Body', duration: 45, price: 800, massagezone: 'Delhi', Description: 'Pressure point therapy for complete relaxation' },
      { massagename: 'Deep Tissue Leg', massagetype: 'Lower Body', duration: 75, price: 1500, massagezone: 'Delhi', Description: 'Intensive deep tissue work for athletes' },
      
      // Torso - Delhi
      { massagename: 'Thai Torso Massage', massagetype: 'Torso', duration: 60, price: 1400, massagezone: 'Delhi', Description: 'Core balancing and spinal alignment' },
      { massagename: 'Hot Stone Back', massagetype: 'Torso', duration: 75, price: 1800, massagezone: 'Delhi', Description: 'Heated basalt stones for deep muscle relaxation' },
      { massagename: 'Aromatherapy Torso', massagetype: 'Torso', duration: 60, price: 1600, massagezone: 'Delhi', Description: 'Essential oils with gentle massage strokes' },
      
      // Upper Body - Delhi
      { massagename: 'Neck & Shoulder Relief', massagetype: 'Upper Body', duration: 45, price: 1000, massagezone: 'Delhi', Description: 'Perfect for desk workers and tension relief' },
      { massagename: 'Thai Head Massage', massagetype: 'Upper Body', duration: 30, price: 900, massagezone: 'Delhi', Description: 'Scalp stimulation and facial acupressure' },
      { massagename: 'Arm & Hand Therapy', massagetype: 'Upper Body', duration: 45, price: 800, massagezone: 'Delhi', Description: 'Circulation boost and joint mobility' },
      { massagename: 'Upper Body Complete', massagetype: 'Upper Body', duration: 75, price: 1700, massagezone: 'Delhi', Description: 'Comprehensive upper body wellness session' },
    ];

    console.log(`Attempting to insert ${massages.length} massages into massage_master table...`);

    // Check if massages already exist
    const { data: existingMassages, error: checkError } = await supabase
      .from('massage_master')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.log('Error checking existing massages:', checkError);
      console.log('Error code:', checkError.code);
      console.log('Error message:', checkError.message);
      console.log('Error details:', checkError.details);
      console.log('Error hint:', checkError.hint);
      
      // Check if table doesn't exist
      if (checkError.code === '42P01' || checkError.message?.includes('does not exist')) {
        return c.json({ 
          error: 'Database table "massage_master" does not exist. Please create the required tables in Supabase.',
          message: 'Please refer to SAVADHIKA_DATABASE_SCHEMA.md for table creation instructions',
          sqlNeeded: true,
          tableNeeded: 'massage_master',
          hint: 'Go to Supabase Dashboard > SQL Editor and create the massage_master table',
          details: checkError 
        }, 500);
      }
      
      return c.json({ 
        error: `Failed to check existing data: ${checkError.message}`,
        code: checkError.code,
        hint: checkError.hint,
        details: checkError 
      }, 500);
    }
    
    if (existingMassages && existingMassages.length > 0) {
      console.log('Massages already exist in database');
      return c.json({ 
        success: true, 
        message: 'Database already initialized',
        count: existingMassages.length,
        alreadyInitialized: true
      });
    }

    // Insert all massages
    console.log('No existing massages found. Inserting new data...');
    const { data, error } = await supabase
      .from('massage_master')
      .insert(massages)
      .select();

    if (error) {
      console.log('Database error inserting massages:', error);
      console.log('Error code:', error.code);
      console.log('Error message:', error.message);
      console.log('Error details:', JSON.stringify(error, null, 2));
      
      // Provide helpful error message based on error code
      let helpfulMessage = error.message;
      if (error.code === '23505') {
        helpfulMessage = 'Duplicate data detected. The massages may already exist in the database.';
      } else if (error.code === '42703') {
        helpfulMessage = 'Column name mismatch. Please verify the massage_master table schema.';
      } else if (error.code === '23502') {
        helpfulMessage = 'Missing required field. Please check the table constraints.';
      }
      
      return c.json({ 
        error: `Failed to insert massages: ${helpfulMessage}`,
        originalError: error.message,
        code: error.code,
        details: error,
        hint: error.hint
      }, 500);
    }

    console.log(`Successfully inserted ${data?.length || 0} massages`);
    
    return c.json({ 
      success: true, 
      message: `${data?.length || 0} massages initialized successfully`,
      count: data?.length || 0,
      massages: data 
    });
  } catch (error) {
    console.log('Initialize massages exception:', error);
    console.log('Exception type:', error.constructor?.name);
    console.log('Exception message:', error.message);
    console.log('Exception stack:', error.stack);
    
    return c.json({ 
      error: `Failed to initialize massages: ${error instanceof Error ? error.message : 'Unknown error'}`,
      exceptionType: error.constructor?.name,
      stack: error instanceof Error ? error.stack : undefined
    }, 500);
  }
});

// ==================== ADMIN ROUTES ====================

// Middleware to check admin access
const checkAdmin = (accessToken: string | undefined, adminKey: string | undefined) => {
  // Check for custom admin key header first
  if (adminKey === 'admin-token-special') {
    return true;
  }
  // Also support the old way for backward compatibility
  return accessToken === 'admin-token-special';
};

// Helper function to get user ID from access token
const getUserIdFromToken = async (accessToken: string | undefined) => {
  console.log('=== getUserIdFromToken START ===');
  console.log('Access token (raw):', accessToken);
  console.log('Token type:', typeof accessToken);
  console.log('Token length:', accessToken?.length);
  
  if (!accessToken) {
    console.log('FAILED: No access token provided');
    return { userId: null, error: 'No access token provided' };
  }

  // Trim whitespace to handle any edge cases
  const token = accessToken.trim();
  console.log('Access token (trimmed):', token);
  console.log('First 10 chars:', token.substring(0, 10));

  // Handle admin token
  if (token === 'admin-token-special') {
    console.log('SUCCESS: Admin token detected');
    return { userId: 'admin', error: null };
  }

  // Handle custom user tokens (format: user-{id}-{timestamp})
  // Check if token starts with 'user-' (case sensitive)
  if (token.indexOf('user-') === 0) {
    console.log('Custom user token detected - processing...');
    const parts = token.split('-');
    console.log('Token parts:', parts);
    console.log('Parts length:', parts.length);
    
    if (parts.length >= 3 && parts[0] === 'user') {
      const userId = parts[1]; // Extract the user ID from the token
      console.log('SUCCESS: Extracted user ID:', userId);
      console.log('=== getUserIdFromToken END - SUCCESS ===');
      return { userId, error: null };
    }
    
    console.log('FAILED: Invalid custom token format - not enough parts');
    console.log('Expected format: user-{id}-{timestamp}');
    console.log('=== getUserIdFromToken END - FAILED ===');
    return { userId: null, error: 'Invalid custom token format' };
  }

  // Only try Supabase Auth for tokens that look like JWTs (start with 'ey')
  // This prevents trying to validate custom tokens as JWTs
  if (!token.startsWith('ey')) {
    console.log('FAILED: Token does not match any known format');
    console.log('Not a custom token (user-*) and not a JWT (ey*)');
    console.log('=== getUserIdFromToken END - FAILED ===');
    return { userId: null, error: 'Invalid token format' };
  }

  // Fallback: Try Supabase Auth for real JWT tokens only
  console.log('JWT token detected, trying Supabase Auth...');
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.log('FAILED: Supabase Auth error:', error?.message);
      console.log('=== getUserIdFromToken END - FAILED ===');
      return { userId: null, error: 'Invalid or expired JWT token' };
    }

    console.log('SUCCESS: Supabase Auth success, user ID:', user.id);
    console.log('=== getUserIdFromToken END - SUCCESS ===');
    return { userId: user.id, error: null };
  } catch (e) {
    console.log('FAILED: Supabase Auth exception:', e.message);
    console.log('=== getUserIdFromToken END - EXCEPTION ===');
    return { userId: null, error: 'JWT validation failed' };
  }
};

// Admin: Add new massage
app.post("/make-server-86f09702/admin/massages", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const adminKey = c.req.header('X-Admin-Key');
    
    console.log('=== ADD MASSAGE REQUEST ===');
    console.log('Add massage - accessToken:', accessToken);
    console.log('Add massage - adminKey:', adminKey);
    console.log('Add massage - checkAdmin result:', checkAdmin(accessToken, adminKey));
    
    if (!checkAdmin(accessToken, adminKey)) {
      console.log('Add massage - FAILED: Admin access denied');
      return c.json({ error: "Admin access required" }, 403);
    }

    const body = await c.req.json();
    console.log('Add massage - Request body:', body);
    
    const { massagename, massagetype, duration, price, massagezone, Description } = body;

    if (!massagename || !massagetype || !duration || !price || !massagezone || !Description) {
      console.log('Add massage - FAILED: Missing required fields');
      console.log('Missing fields:', { 
        massagename: !massagename, 
        massagetype: !massagetype, 
        duration: !duration, 
        price: !price, 
        massagezone: !massagezone, 
        Description: !Description 
      });
      return c.json({ error: "All fields are required" }, 400);
    }

    const insertData = {
      massagename,
      massagetype,
      duration: Number(duration),
      price: Number(price),
      massagezone,
      Description
    };
    
    console.log('Add massage - Inserting data:', insertData);

    // Insert into massage_master table
    const { data, error } = await supabase
      .from('massage_master')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.log('Add massage - DATABASE ERROR:', error);
      console.log('Add massage - Error details:', JSON.stringify(error, null, 2));
      return c.json({ error: `Failed to add massage: ${error.message}`, details: error }, 500);
    }

    console.log('Add massage - SUCCESS:', data);
    return c.json({ success: true, massage: data });
  } catch (error) {
    console.log('Add massage - EXCEPTION:', error);
    console.log('Add massage - Exception details:', error.message, error.stack);
    return c.json({ error: `Failed to add massage: ${error.message}` }, 500);
  }
});

// Admin: Update massage
app.put("/make-server-86f09702/admin/massages/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const adminKey = c.req.header('X-Admin-Key');
    
    if (!checkAdmin(accessToken, adminKey)) {
      return c.json({ error: "Admin access required" }, 403);
    }

    const id = c.req.param('id');
    const { massagename, massagetype, duration, price, massagezone, Description } = await c.req.json();

    // Update in massage_master table
    const { data, error } = await supabase
      .from('massage_master')
      .update({
        massagename,
        massagetype,
        duration: Number(duration),
        price: Number(price),
        massagezone,
        Description
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.log(`Admin update massage error: ${error.message}`);
      return c.json({ error: `Failed to update massage: ${error.message}` }, 500);
    }

    if (!data) {
      return c.json({ error: "Massage not found" }, 404);
    }

    return c.json({ success: true, massage: data });
  } catch (error) {
    console.log(`Admin update massage exception: ${error.message}`);
    return c.json({ error: "Failed to update massage" }, 500);
  }
});

// Admin: Delete massage
app.delete("/make-server-86f09702/admin/massages/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const adminKey = c.req.header('X-Admin-Key');
    
    if (!checkAdmin(accessToken, adminKey)) {
      return c.json({ error: "Admin access required" }, 403);
    }

    const id = c.req.param('id');
    
    // Delete from massage_master table
    const { error } = await supabase
      .from('massage_master')
      .delete()
      .eq('id', id);

    if (error) {
      console.log(`Admin delete massage error: ${error.message}`);
      return c.json({ error: `Failed to delete massage: ${error.message}` }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.log(`Admin delete massage exception: ${error.message}`);
    return c.json({ error: "Failed to delete massage" }, 500);
  }
});

// Admin: Get all bookings (all users)
app.get("/make-server-86f09702/admin/bookings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const adminKey = c.req.header('X-Admin-Key');
    
    if (!checkAdmin(accessToken, adminKey)) {
      return c.json({ error: "Admin access required" }, 403);
    }

    const allBookings = await kv.getByPrefix('booking:');
    
    // Sort by created_at descending
    allBookings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return c.json({ bookings: allBookings });
  } catch (error) {
    console.log(`Admin get all bookings error: ${error.message}`);
    return c.json({ error: "Failed to fetch bookings" }, 500);
  }
});

// ==================== CART ROUTES ====================

// Add item to cart
app.post("/make-server-86f09702/cart/add", async (c) => {
  console.log('=== ADD TO CART ENDPOINT ===');
  
  try {
    const customToken = c.req.header('X-User-Token');
    const rawAuthHeader = c.req.header('Authorization');
    let accessToken = customToken || rawAuthHeader?.split(' ')[1];
    
    console.log('Add to cart - customToken:', customToken);
    console.log('Add to cart - rawAuthHeader:', rawAuthHeader);
    console.log('Add to cart - accessToken:', accessToken);
    
    const { userId, error: authError } = await getUserIdFromToken(accessToken);
    
    if (!userId || authError) {
      console.log('Add to cart - Auth failed:', authError);
      return c.json({ code: 401, message: "Unauthorized", error: authError }, 401);
    }

    console.log('Add to cart - User authenticated:', userId);

    const body = await c.req.json();
    const { massage_id } = body;

    console.log('Add to cart - massage_id:', massage_id);

    if (!massage_id) {
      return c.json({ code: 400, message: "Massage ID is required" }, 400);
    }

    console.log('Inserting into cart_master table...');
    console.log('Customer ID:', userId);
    console.log('Massage ID:', massage_id);
    
    // Insert into cart_master table
    const { data: cartItem, error: cartError } = await supabase
      .from('cart_master')
      .insert({
        customerid: parseInt(userId),
        massageid: massage_id,
        transactiondate: new Date().toISOString(),
        quantity: 1
      })
      .select()
      .single();
    
    console.log('Cart insert result - data:', cartItem, 'error:', cartError);
    
    if (cartError) {
      console.log('Failed to insert into cart_master:', cartError);
      console.log('Error details:', JSON.stringify(cartError, null, 2));
      console.log('Error message:', cartError.message);
      console.log('Error code:', cartError.code);
      console.log('Error hint:', cartError.hint);
      
      return c.json({ 
        code: 500, 
        message: "Failed to add to cart",
        error: cartError.message,
        errorCode: cartError.code,
        errorHint: cartError.hint,
        details: "Database error while inserting into cart_master table. Please ensure the table exists."
      }, 500);
    }

    console.log('Successfully added to cart:', cartItem);

    return c.json({ 
      success: true, 
      message: "Added to cart successfully",
      cartItem: cartItem
    });
  } catch (error) {
    console.log('Add to cart exception:', error.message);
    return c.json({ 
      code: 500, 
      message: "Failed to add to cart", 
      error: error.message 
    }, 500);
  }
});

// Get cart items for user
app.get("/make-server-86f09702/cart/items", async (c) => {
  console.log('=== GET CART ITEMS ENDPOINT ===');
  
  try {
    const customToken = c.req.header('X-User-Token');
    const rawAuthHeader = c.req.header('Authorization');
    let accessToken = customToken || rawAuthHeader?.split(' ')[1];
    
    const { userId, error: authError } = await getUserIdFromToken(accessToken);
    
    if (!userId || authError) {
      return c.json({ code: 401, message: "Unauthorized" }, 401);
    }

    console.log('Fetching cart items for user:', userId);
    
    // Get cart items from cart_master table
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_master')
      .select('*')
      .eq('customerid', parseInt(userId))
      .order('created_at', { ascending: false });
    
    if (cartError) {
      console.log('Error fetching cart items:', cartError);
      return c.json({ code: 500, message: "Failed to fetch cart items", error: cartError.message }, 500);
    }

    console.log('Found cart items:', cartItems?.length || 0);

    // Get massage details for each cart item
    const itemsWithDetails = await Promise.all(
      (cartItems || []).map(async (item) => {
        const { data: massage } = await supabase
          .from('massage_master')
          .select('*')
          .eq('id', item.massageid)
          .single();
        
        console.log(`Cart item ${item.id} - massageid: ${item.massageid}, amount from cart: ${item.amount}, price from massage: ${massage?.price}`);
        
        return {
          ...item,
          massage: massage ? {
            id: massage.id,
            name: massage.massagename,
            // Use amount from cart_master if available, otherwise use price from massage_master
            price: item.amount || massage.price,
            duration: `${massage.duration} min`,
            massage_zone: massage.massagezone,
            description: massage.description || massage.Description,
            body_area: massage.massagetype
          } : null
        };
      })
    );

    console.log('Items with details:', itemsWithDetails.map(item => ({
      id: item.id,
      massageid: item.massageid,
      massageName: item.massage?.name,
      price: item.massage?.price,
      quantity: item.quantity,
      amount: item.amount
    })));

    return c.json({ success: true, items: itemsWithDetails });
  } catch (error) {
    console.log('Get cart items error:', error.message);
    return c.json({ code: 500, message: "Failed to fetch cart items", error: error.message }, 500);
  }
});

// Remove cart item
app.delete("/make-server-86f09702/cart/remove/:itemId", async (c) => {
  console.log('=== REMOVE CART ITEM ENDPOINT ===');
  
  try {
    const customToken = c.req.header('X-User-Token');
    const rawAuthHeader = c.req.header('Authorization');
    let accessToken = customToken || rawAuthHeader?.split(' ')[1];
    
    const { userId, error: authError } = await getUserIdFromToken(accessToken);
    
    if (!userId || authError) {
      return c.json({ code: 401, message: "Unauthorized" }, 401);
    }

    const itemId = c.req.param('itemId');
    console.log('Removing cart item:', itemId, 'for user:', userId);
    
    // Delete the cart item
    const { error: deleteError } = await supabase
      .from('cart_master')
      .delete()
      .eq('id', parseInt(itemId))
      .eq('customerid', parseInt(userId));
    
    if (deleteError) {
      console.log('Error removing cart item:', deleteError);
      return c.json({ code: 500, message: "Failed to remove item", error: deleteError.message }, 500);
    }

    return c.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.log('Remove cart item error:', error.message);
    return c.json({ code: 500, message: "Failed to remove item", error: error.message }, 500);
  }
});

// Clear entire cart for a customer (after successful payment)
app.delete("/make-server-86f09702/cart/clear", async (c) => {
  console.log('=== CLEAR CART ENDPOINT ===');
  
  try {
    const customToken = c.req.header('X-User-Token');
    const rawAuthHeader = c.req.header('Authorization');
    let accessToken = customToken || rawAuthHeader?.split(' ')[1];
    
    const { userId, error: authError } = await getUserIdFromToken(accessToken);
    
    if (!userId || authError) {
      console.log('Authentication failed:', authError);
      return c.json({ code: 401, message: "Unauthorized" }, 401);
    }

    console.log('Clearing cart for customer:', userId);
    
    // Delete all cart items for this customer from cart_master
    const { data, error: deleteError } = await supabase
      .from('cart_master')
      .delete()
      .eq('customerid', parseInt(userId))
      .select();
    
    if (deleteError) {
      console.log('Error clearing cart:', deleteError);
      return c.json({ code: 500, message: "Failed to clear cart", error: deleteError.message }, 500);
    }

    console.log('Cart cleared successfully. Deleted items:', data?.length || 0);

    return c.json({ 
      success: true, 
      message: "Cart cleared successfully",
      itemsDeleted: data?.length || 0
    });
  } catch (error) {
    console.log('Clear cart error:', error.message);
    return c.json({ code: 500, message: "Failed to clear cart", error: error.message }, 500);
  }
});

// Create payment order (Razorpay)
app.post("/make-server-86f09702/payment/create-order", async (c) => {
  console.log('=== CREATE PAYMENT ORDER ENDPOINT ===');
  
  try {
    const customToken = c.req.header('X-User-Token');
    const rawAuthHeader = c.req.header('Authorization');
    let accessToken = customToken || rawAuthHeader?.split(' ')[1];
    
    const { userId, error: authError } = await getUserIdFromToken(accessToken);
    
    if (!userId || authError) {
      return c.json({ code: 401, message: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { amount, currency, coupon_code } = body;

    console.log('Creating order for user:', userId);
    console.log('Amount:', amount, 'Currency:', currency);

    // For demo purposes, return mock Razorpay data
    // In production, you would:
    // 1. Get Razorpay Key & Secret from environment variables
    // 2. Create order using Razorpay API
    // 3. Store order details in database
    
    console.log('⚠️  RAZORPAY INTEGRATION NOTE:');
    console.log('To enable real payments, you need to:');
    console.log('1. Sign up at https://razorpay.com/');
    console.log('2. Get your API Key and Secret from Razorpay Dashboard');
    console.log('3. Update the razorpay_key in this endpoint');
    console.log('4. Add Razorpay order creation logic');
    
    const orderId = `order_${Date.now()}`;
    
    return c.json({
      success: true,
      order_id: orderId,
      amount: amount * 100, // Razorpay expects paise
      currency: currency || 'INR',
      razorpay_key: 'rzp_test_demo_key', // Replace with actual Razorpay key from environment
      note: 'Demo mode - Replace with actual Razorpay integration'
    });
  } catch (error) {
    console.log('Create payment order error:', error.message);
    return c.json({ code: 500, message: "Failed to create order", error: error.message }, 500);
  }
});

// Verify payment (Razorpay)
app.post("/make-server-86f09702/payment/verify", async (c) => {
  console.log('=== VERIFY PAYMENT ENDPOINT ===');
  
  try {
    const customToken = c.req.header('X-User-Token');
    const rawAuthHeader = c.req.header('Authorization');
    let accessToken = customToken || rawAuthHeader?.split(' ')[1];
    
    const { userId, error: authError } = await getUserIdFromToken(accessToken);
    
    if (!userId || authError) {
      return c.json({ code: 401, message: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    console.log('Verifying payment for user:', userId);
    console.log('Payment ID:', razorpay_payment_id);

    // In production, verify the signature using Razorpay secret
    // For now, just accept the payment
    
    // Clear the cart after successful payment
    const { error: clearError } = await supabase
      .from('cart_master')
      .delete()
      .eq('customerid', parseInt(userId));
    
    if (clearError) {
      console.log('Error clearing cart:', clearError);
    }

    return c.json({
      success: true,
      message: "Payment verified successfully"
    });
  } catch (error) {
    console.log('Verify payment error:', error.message);
    return c.json({ code: 500, message: "Failed to verify payment", error: error.message }, 500);
  }
});

// Create transaction after successful payment
app.post("/make-server-86f09702/transaction/create", async (c) => {
  console.log('=== CREATE TRANSACTION ENDPOINT ===');
  
  try {
    const body = await c.req.json();
    const { customerId, massageId, couponCode, amount, city } = body;
    
    console.log('Transaction data:', { customerId, massageId, couponCode, amount, city });
    
    // Validate required fields
    if (!customerId || !massageId) {
      console.log('Missing required fields');
      return c.json({
        success: false,
        error: 'Customer ID and Massage ID are required'
      }, 400);
    }
    
    // Insert into cust_mass_trans table (without city for now until column is added to database)
    const { data, error } = await supabase
      .from('cust_mass_trans')
      .insert([
        {
          custid: customerId,
          massid: massageId,
          datetrans: new Date().toISOString(),
          coupon_code: couponCode || null,
          amount: amount || 0
        }
      ])
      .select();
    
    if (error) {
      console.log('Database error creating transaction:', error);
      return c.json({
        success: false,
        error: error.message,
        details: error
      }, 500);
    }
    
    console.log('Transaction created successfully:', data);
    
    return c.json({
      success: true,
      transaction: data[0]
    });
  } catch (error) {
    console.log('Error creating transaction:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Store payment information
app.post("/make-server-86f09702/payment/store-info", async (c) => {
  console.log('=== STORE PAYMENT INFO ENDPOINT ===');
  
  try {
    const body = await c.req.json();
    const { customerId, paymentMethod, amount, selectedOption, cardDetails, upiDetails, bankName } = body;
    
    console.log('Payment info data:', { customerId, paymentMethod, amount });
    
    // Validate required fields
    if (!customerId || !paymentMethod || !amount) {
      console.log('Missing required fields');
      return c.json({
        success: false,
        error: 'Customer ID, Payment Method, and Amount are required'
      }, 400);
    }
    
    // Build payment details description
    let paymentDetails = '';
    
    switch(paymentMethod) {
      case 'upi':
        if (selectedOption) {
          const upiAppNames = {
            'gpay': 'Google Pay',
            'phonepe': 'PhonePe',
            'paytm': 'Paytm',
            'bhim': 'BHIM UPI'
          };
          paymentDetails = `UPI Payment via ${upiAppNames[selectedOption] || selectedOption}. Amount: ₹${amount}`;
        } else if (upiDetails) {
          paymentDetails = `UPI Payment via UPI ID: ${upiDetails}. Amount: ₹${amount}`;
        } else {
          paymentDetails = `UPI Payment. Amount: ₹${amount}`;
        }
        break;
        
      case 'card':
        if (cardDetails) {
          const cardType = cardDetails.startsWith('4') ? 'Visa' : 
                          cardDetails.startsWith('5') ? 'Mastercard' : 
                          cardDetails.startsWith('6') ? 'RuPay' : 'Card';
          const maskedCard = `****${cardDetails.slice(-4)}`;
          paymentDetails = `${cardType} Card Payment (${maskedCard}). Amount: ₹${amount}`;
        } else {
          paymentDetails = `Credit/Debit Card Payment. Amount: ₹${amount}`;
        }
        break;
        
      case 'netbanking':
        paymentDetails = `Net Banking Payment${bankName ? ` via ${bankName}` : ''}. Amount: ₹${amount}`;
        break;
        
      case 'wallet':
        const walletNames = {
          'paytm-wallet': 'Paytm Wallet',
          'phonepe-wallet': 'PhonePe Wallet',
          'mobikwik': 'Mobikwik',
          'freecharge': 'Freecharge',
          'amazon-pay': 'Amazon Pay'
        };
        paymentDetails = `Wallet Payment via ${walletNames[selectedOption] || selectedOption}. Amount: ₹${amount}`;
        break;
        
      case 'paylater':
        const paylaterNames = {
          'lazypay': 'LazyPay',
          'simpl': 'Simpl',
          'zestmoney': 'ZestMoney'
        };
        paymentDetails = `Pay Later via ${paylaterNames[selectedOption] || selectedOption}. Amount: ₹${amount}`;
        break;
        
      default:
        paymentDetails = `Payment via ${paymentMethod}. Amount: ₹${amount}`;
    }
    
    console.log('Payment details description:', paymentDetails);
    
    // Insert into customer_payments table
    const { data, error } = await supabase
      .from('customer_payments')
      .insert([
        {
          customerid: customerId,
          paymentdetails: paymentDetails
        }
      ])
      .select();
    
    if (error) {
      console.log('Database error storing payment info:', error);
      return c.json({
        success: false,
        error: error.message,
        details: error
      }, 500);
    }
    
    console.log('Payment info stored successfully:', data);
    
    return c.json({
      success: true,
      paymentInfo: data[0]
    });
  } catch (error) {
    console.log('Error storing payment info:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// MIS Report - Get bookings by date range
app.post("/make-server-86f09702/mis-report", async (c) => {
  console.log('=== MIS REPORT ENDPOINT ===');
  
  try {
    const body = await c.req.json();
    const { startDate, endDate } = body;
    
    console.log('Fetching bookings from', startDate, 'to', endDate);
    
    // Validate dates
    if (!startDate || !endDate) {
      return c.json({
        success: false,
        error: 'Start date and end date are required'
      }, 400);
    }
    
    // First, get all transactions in the date range
    const { data: transactions, error: transError } = await supabase
      .from('cust_mass_trans')
      .select('*')
      .gte('datetrans', `${startDate}T00:00:00`)
      .lte('datetrans', `${endDate}T23:59:59`)
      .order('datetrans', { ascending: false });
    
    if (transError) {
      console.error('Error fetching transactions:', transError);
      return c.json({
        success: false,
        error: transError.message,
        details: transError
      }, 500);
    }
    
    console.log('Found transactions:', transactions?.length || 0);
    
    if (!transactions || transactions.length === 0) {
      return c.json({
        success: true,
        bookings: [],
        count: 0
      });
    }
    
    // Get unique customer IDs and massage IDs
    const customerIds = [...new Set(transactions.map(t => t.custid))];
    const massageIds = [...new Set(transactions.map(t => t.massid))];
    
    console.log('Customer IDs:', customerIds);
    console.log('Massage IDs:', massageIds);
    
    // Fetch customers
    const { data: customers, error: custError } = await supabase
      .from('customer_master')
      .select('*')
      .in('id', customerIds);
    
    if (custError) {
      console.error('Error fetching customers:', custError);
    }
    
    // Fetch massages
    const { data: massages, error: massError } = await supabase
      .from('massage_master')
      .select('*')
      .in('id', massageIds);
    
    if (massError) {
      console.error('Error fetching massages:', massError);
    }
    
    console.log('Customers found:', customers?.length || 0);
    console.log('Massages found:', massages?.length || 0);
    
    // Create lookup maps
    const customerMap = new Map(customers?.map(c => [c.id, c]) || []);
    const massageMap = new Map(massages?.map(m => [m.id, m]) || []);
    
    // Transform data
    const bookings = transactions.map(trans => {
      const customer = customerMap.get(trans.custid);
      const massage = massageMap.get(trans.massid);
      
      const transDate = new Date(trans.datetrans);
      const bookingDate = transDate.toISOString().split('T')[0];
      const bookingTime = transDate.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      
      return {
        trans_id: trans.trans_id,
        booking_date: bookingDate,
        booking_time: bookingTime,
        customer_name: customer?.customername || 'N/A',
        customer_email: customer?.email || 'N/A',
        customer_phone: customer?.['mobile no'] || 'N/A',
        massage_name: massage?.massagename || 'N/A',
        massage_type: massage?.massagetype || 'N/A',
        city: massage?.massagezone || 'N/A',
        massage_price: trans.amount || massage?.price || 0
      };
    });
    
    console.log('Returning bookings:', bookings.length);
    
    return c.json({
      success: true,
      bookings: bookings,
      count: bookings.length
    });
  } catch (error) {
    console.log('MIS report error:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

Deno.serve(app.fetch);