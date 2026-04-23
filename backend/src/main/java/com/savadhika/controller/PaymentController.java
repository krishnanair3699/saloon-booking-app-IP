package com.savadhika.controller;

import com.savadhika.dto.CouponValidationResponse;
import com.savadhika.dto.PaymentRequest;
import com.savadhika.service.CouponService;
import com.savadhika.service.PaymentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/**
 * REST Controller for payment endpoints
 * Handles payment processing and coupon validation
 */
@RestController
@RequestMapping("/payments")

@CrossOrigin(origins = "*")
public class PaymentController {
    
    @org.springframework.beans.factory.annotation.Autowired
    private PaymentService paymentService;
    @org.springframework.beans.factory.annotation.Autowired
    private CouponService couponService;
    
    /**
     * POST /payments/process
     * Process payment and create transaction
     */
    @PostMapping("/process")
    public ResponseEntity<?> processPayment(@RequestBody PaymentRequest request) {
        try {
            Map<String, Object> response = paymentService.processPayment(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", e.getMessage())
            );
        }
    }
    
    /**
     * POST /payments/validate-coupon
     * Validate a coupon code and calculate discount
     */
    @PostMapping("/validate-coupon")
    public ResponseEntity<CouponValidationResponse> validateCoupon(
            @RequestBody Map<String, Object> request
    ) {
        String couponCode = (String) request.get("couponCode");
        Long customerId = Long.valueOf(request.get("customerId").toString());
        Double amount = Double.valueOf(request.get("amount").toString());
        
        CouponValidationResponse response = couponService.validateCoupon(
            couponCode, 
            customerId, 
            amount
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /payments/history/{customerId}
     * Get payment history for a customer
     */
    @GetMapping("/history/{customerId}")
    public ResponseEntity<?> getPaymentHistory(@PathVariable Long customerId) {
        try {
            var history = paymentService.getPaymentHistory(customerId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "payments", history
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", e.getMessage())
            );
        }
    }
}
