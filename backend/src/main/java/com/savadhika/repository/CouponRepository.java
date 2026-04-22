package com.savadhika.repository;

import com.savadhika.model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository interface for Coupon entity
 * Provides database operations for coupon_master table
 */
@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    
    /**
     * Find coupon by code
     */
    Optional<Coupon> findByCouponCode(String couponCode);
    
    /**
     * Find active coupons
     */
    java.util.List<Coupon> findByIsActiveTrue();
}
