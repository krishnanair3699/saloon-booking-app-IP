package com.savadhika.service;

import com.savadhika.dto.AuthRequest;
import com.savadhika.dto.AuthResponse;
import com.savadhika.dto.SignupRequest;
import com.savadhika.model.Customer;
import com.savadhika.repository.CustomerRepository;
import com.savadhika.util.JwtUtil;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for handling authentication operations
 * Includes signup, login, and user management
 */
@Service

public class AuthService {
    
    @org.springframework.beans.factory.annotation.Autowired
    private CustomerRepository customerRepository;
    @org.springframework.beans.factory.annotation.Autowired
    private PasswordEncoder passwordEncoder;
    @org.springframework.beans.factory.annotation.Autowired
    private JwtUtil jwtUtil;
    
    /**
     * Register a new customer
     */
    @Transactional
    public AuthResponse signup(SignupRequest request) {
        // Check if email already exists
        if (customerRepository.existsByCustomerEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        // Check if phone already exists
        if (customerRepository.existsByCustomerPhone(request.getPhone())) {
            throw new RuntimeException("Phone number already registered");
        }
        
        // Create new customer
        Customer customer = new Customer();
        customer.setCustomerName(request.getName());
        customer.setCustomerEmail(request.getEmail());
        customer.setCustomerPhone(request.getPhone());
        customer.setCustomerPassword(passwordEncoder.encode(request.getPassword()));
        customer.setIsAdmin(false);
        
        Customer savedCustomer = customerRepository.save(customer);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(savedCustomer.getCustomerEmail());
        
        return new AuthResponse(
            token,
            savedCustomer.getCustomerEmail(),
            savedCustomer.getCustomerName(),
            savedCustomer.getCustomerId(),
            savedCustomer.getIsAdmin(),
            "Signup successful"
        );
    }
    
    /**
     * Authenticate user and generate token
     */
    public AuthResponse login(AuthRequest request) {
        Customer customer = customerRepository.findByCustomerEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), customer.getCustomerPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(customer.getCustomerEmail());
        
        return new AuthResponse(
            token,
            customer.getCustomerEmail(),
            customer.getCustomerName(),
            customer.getCustomerId(),
            customer.getIsAdmin(),
            "Login successful"
        );
    }
    
    /**
     * Get customer by email (from JWT token)
     */
    public Customer getCustomerByEmail(String email) {
        return customerRepository.findByCustomerEmail(email)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
    }
}
