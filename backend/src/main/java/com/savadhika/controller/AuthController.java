package com.savadhika.controller;

import com.savadhika.dto.AuthRequest;
import com.savadhika.dto.AuthResponse;
import com.savadhika.dto.SignupRequest;
import com.savadhika.service.AuthService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for authentication endpoints
 * Handles signup, login, and user management
 */
@RestController
@RequestMapping("/auth")

@CrossOrigin(origins = "*")
public class AuthController {
    
    @org.springframework.beans.factory.annotation.Autowired
    private AuthService authService;
    
    /**
     * POST /auth/signup
     * Register a new customer
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        try {
            AuthResponse response = authService.signup(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ErrorResponse(e.getMessage())
            );
        }
    }
    
    /**
     * POST /auth/login
     * Authenticate user and return JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ErrorResponse(e.getMessage())
            );
        }
    }
    
    /**
     * GET /auth/me
     * Get current user information (requires authentication)
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            // Extract email from JWT token
            String email = token.replace("Bearer ", "");
            // This would need JWT validation - simplified for now
            return ResponseEntity.ok("User authenticated");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ErrorResponse(e.getMessage())
            );
        }
    }
    
    /**
     * Error response DTO
     */
    record ErrorResponse(String error) {}
}
