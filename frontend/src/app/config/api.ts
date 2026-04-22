/**
 * API Configuration — Saloon & Spa Booking Portal
 * Connects React frontend to Java Spring Boot backend
 */

// LOCAL development → Spring Boot running on your machine
// PRODUCTION → your Render.com deployed backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Central fetch helper — attaches JWT token to every request automatically
 */
export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem('accessToken');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
}

/**
 * All REST API endpoint paths — matches Spring Boot controllers exactly
 */
export const API = {

  // ── AUTH (/api/auth/...)
  auth: {
    signup:  '/auth/signup',   // POST → register new customer
    signin:  '/auth/signin',   // POST → login, returns JWT token
    me:      '/auth/me',       // GET  → get logged-in user info
  },

  // ── SERVICES / MASSAGES (/api/massages/...)
  massages: {
    getAll:     '/massages',             // GET  → all available services
    initialize: '/massages/initialize',  // POST → seed default services (admin)
    update: (id: number) => `/admin/massages/${id}`,  // PUT
    delete: (id: number) => `/admin/massages/${id}`,  // DELETE
  },

  // ── BOOKINGS (/api/bookings/...)
  bookings: {
    create:  '/bookings',                       // POST → create appointment
    getAll:  '/bookings',                       // GET  → all bookings (admin)
    getById: (id: number) => `/bookings/${id}`, // GET  → single booking
    slots:   (date: string) => `/bookings/slots?date=${date}`, // GET → free slots
    cancel:  (id: number) => `/bookings/${id}`, // DELETE
    updateStatus: (id: number) => `/bookings/${id}/status`,    // PUT
  },

  // ── CART (/api/cart/...)
  cart: {
    add:    '/cart/add',                          // POST
    items:  '/cart/items',                        // GET
    remove: (itemId: number) => `/cart/remove/${itemId}`, // DELETE
    clear:  '/cart/clear',                        // DELETE
  },

  // ── PAYMENT (/api/payment/...)
  payment: {
    createOrder: '/payment/create-order', // POST → initiate Razorpay order
    verify:      '/payment/verify',       // POST → confirm payment
    storeInfo:   '/payment/store-info',   // GET  → store/salon info
  },

  // ── TRANSACTIONS (/api/transaction/...)
  transaction: {
    create: '/transaction/create', // POST → log completed payment
  },

  // ── ADMIN (/api/admin/...)
  admin: {
    massages:      '/admin/massages',             // GET all services (admin)
    updateMassage: (id: number) => `/admin/massages/${id}`,
    deleteMassage: (id: number) => `/admin/massages/${id}`,
    bookings:      '/admin/bookings',             // GET all bookings (admin)
  },

  // ── REPORTS (/api/mis-report/...)
  reports: {
    mis: '/mis-report', // GET → MIS report for admin dashboard
  },
};

export default API;
