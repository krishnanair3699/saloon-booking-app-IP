package com.savadhika.controller;

import com.savadhika.dto.BookingRequest;
import com.savadhika.model.Cart;
import com.savadhika.service.BookingService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for booking endpoints
 * Handles cart operations and booking management
 */
@RestController
@RequestMapping("/bookings")

@CrossOrigin(origins = "*")
public class BookingController {
    
    @org.springframework.beans.factory.annotation.Autowired
    private BookingService bookingService;
    
    /**
     * POST /bookings/cart
     * Add a massage to cart
     */
    @PostMapping("/cart")
    public ResponseEntity<?> addToCart(@RequestBody BookingRequest request) {
        try {
            Cart cart = bookingService.addToCart(request);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "cartItem", cart,
                "message", "Added to cart successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", e.getMessage())
            );
        }
    }
    
    /**
     * GET /bookings/cart/{customerId}
     * Get all cart items for a customer
     */
    @GetMapping("/cart/{customerId}")
    public ResponseEntity<?> getCartItems(@PathVariable Long customerId) {
        try {
            List<Map<String, Object>> cartItems = bookingService.getCartItems(customerId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "cartItems", cartItems
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", e.getMessage())
            );
        }
    }
    
    /**
     * DELETE /bookings/cart/{cartId}
     * Remove item from cart
     */
    @DeleteMapping("/cart/{cartId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long cartId) {
        try {
            bookingService.removeFromCart(cartId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Item removed from cart"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", e.getMessage())
            );
        }
    }
    
    /**
     * DELETE /bookings/cart/clear/{customerId}
     * Clear all cart items for a customer
     */
    @DeleteMapping("/cart/clear/{customerId}")
    public ResponseEntity<?> clearCart(@PathVariable Long customerId) {
        try {
            bookingService.clearCart(customerId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Cart cleared successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", e.getMessage())
            );
        }
    }
    
    /**
     * GET /bookings/cart/count/{customerId}
     * Get cart item count for a customer
     */
    @GetMapping("/cart/count/{customerId}")
    public ResponseEntity<?> getCartCount(@PathVariable Long customerId) {
        try {
            long count = bookingService.getCartCount(customerId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "count", count
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", e.getMessage())
            );
        }
    }
}
