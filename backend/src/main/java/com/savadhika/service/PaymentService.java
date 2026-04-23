package com.savadhika.service;

import com.savadhika.dto.CouponValidationResponse;
import com.savadhika.dto.PaymentRequest;
import com.savadhika.model.*;
import com.savadhika.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.Map;

/**
 * Service for handling payment operations
 * Manages payment processing, transaction creation, and cart clearing
 */
@Service

public class PaymentService {
    
    @org.springframework.beans.factory.annotation.Autowired
    private PaymentRepository paymentRepository;
    @org.springframework.beans.factory.annotation.Autowired
    private TransactionRepository transactionRepository;
    @org.springframework.beans.factory.annotation.Autowired
    private CartRepository cartRepository;
    @org.springframework.beans.factory.annotation.Autowired
    private CouponService couponService;
    @org.springframework.beans.factory.annotation.Autowired
    private CouponUsageRepository couponUsageRepository;
    
    /**
     * Process payment and create transaction
     * This is the core business logic for completing a booking
     */
    @Transactional
    public Map<String, Object> processPayment(PaymentRequest request) {
        Double finalAmount = request.getAmount();
        Double discountAmount = 0.0;
        
        // Validate and apply coupon if provided
        if (request.getCouponCode() != null && !request.getCouponCode().isEmpty()) {
            CouponValidationResponse couponValidation = couponService.validateCoupon(
                request.getCouponCode(), 
                request.getCustomerId(), 
                request.getAmount()
            );
            
            if (!couponValidation.getValid()) {
                throw new RuntimeException(couponValidation.getMessage());
            }
            
            finalAmount = couponValidation.getFinalAmount();
            discountAmount = couponValidation.getDiscountAmount();
        }
        
        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setCustomerId(request.getCustomerId());
        transaction.setMassageId(request.getMassageId());
        transaction.setCouponCode(request.getCouponCode());
        transaction.setAmount(finalAmount);
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        
        // Create payment record
        Payment payment = new Payment();
        payment.setCustomerId(request.getCustomerId());
        payment.setTransactionId(savedTransaction.getTransactionId());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentDetails(request.getPaymentDetails());
        payment.setAmount(finalAmount);
        
        Payment savedPayment = paymentRepository.save(payment);
        
        // Record coupon usage if coupon was applied
        if (request.getCouponCode() != null && !request.getCouponCode().isEmpty()) {
            CouponUsage couponUsage = new CouponUsage();
            couponUsage.setCustomerId(request.getCustomerId());
            couponUsage.setCouponCode(request.getCouponCode().toUpperCase());
            couponUsage.setTransactionId(savedTransaction.getTransactionId());
            couponUsage.setDiscountAmount(discountAmount);
            couponUsageRepository.save(couponUsage);
        }
        
        // Clear customer's cart after successful payment
        cartRepository.deleteByCustomerId(request.getCustomerId());
        
        // Return response
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("transactionId", savedTransaction.getTransactionId());
        response.put("paymentId", savedPayment.getPaymentId());
        response.put("amount", finalAmount);
        response.put("discountAmount", discountAmount);
        response.put("message", "Payment processed successfully");
        
        return response;
    }
    
    /**
     * Get payment history for a customer
     */
    public java.util.List<Payment> getPaymentHistory(Long customerId) {
        return paymentRepository.findByCustomerId(customerId);
    }
}
