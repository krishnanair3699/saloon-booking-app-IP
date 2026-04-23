package com.savadhika.service;

import com.savadhika.dto.CouponValidationResponse;
import com.savadhika.model.Coupon;
import com.savadhika.repository.CouponRepository;
import com.savadhika.repository.CouponUsageRepository;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

/**
 * Service for handling coupon operations
 * Business logic for coupon validation and discount calculation
 */
@Service

public class CouponService {
    
    @org.springframework.beans.factory.annotation.Autowired
    private CouponRepository couponRepository;
    @org.springframework.beans.factory.annotation.Autowired
    private CouponUsageRepository couponUsageRepository;
    
    /**
     * Validate coupon and calculate discount
     */
    public CouponValidationResponse validateCoupon(String couponCode, Long customerId, Double originalAmount) {
        CouponValidationResponse response = new CouponValidationResponse();
        
        // Find coupon by code
        Coupon coupon = couponRepository.findByCouponCode(couponCode.toUpperCase())
            .orElse(null);
        
        if (coupon == null) {
            response.setValid(false);
            response.setMessage("Invalid coupon code");
            return response;
        }
        
        // Check if coupon is active
        if (!coupon.getIsActive()) {
            response.setValid(false);
            response.setMessage("This coupon is no longer active");
            return response;
        }
        
        // Check validity dates
        LocalDateTime now = LocalDateTime.now();
        if (coupon.getValidFrom() != null && now.isBefore(coupon.getValidFrom())) {
            response.setValid(false);
            response.setMessage("This coupon is not yet valid");
            return response;
        }
        
        if (coupon.getValidUntil() != null && now.isAfter(coupon.getValidUntil())) {
            response.setValid(false);
            response.setMessage("This coupon has expired");
            return response;
        }
        
        // Check if customer has already used this coupon
        if (couponUsageRepository.existsByCustomerIdAndCouponCode(customerId, couponCode.toUpperCase())) {
            response.setValid(false);
            response.setMessage("You have already used this coupon");
            return response;
        }
        
        // Calculate discount
        Double discountPercentage = coupon.getDiscountPercentage();
        Double discountAmount = (originalAmount * discountPercentage) / 100;
        
        // Apply max discount limit if exists
        if (coupon.getMaxDiscountAmount() != null && discountAmount > coupon.getMaxDiscountAmount()) {
            discountAmount = coupon.getMaxDiscountAmount();
        }
        
        Double finalAmount = originalAmount - discountAmount;
        
        response.setValid(true);
        response.setMessage("Coupon applied successfully!");
        response.setDiscountPercentage(discountPercentage);
        response.setDiscountAmount(discountAmount);
        response.setFinalAmount(finalAmount);
        
        return response;
    }
    
    /**
     * Get all active coupons
     */
    public java.util.List<Coupon> getActiveCoupons() {
        return couponRepository.findByIsActiveTrue();
    }
    
    /**
     * Create new coupon (Admin only)
     */
    public Coupon createCoupon(Coupon coupon) {
        coupon.setCouponCode(coupon.getCouponCode().toUpperCase());
        return couponRepository.save(coupon);
    }
}
