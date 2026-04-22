package com.savadhika.repository;

import com.savadhika.model.CouponUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository interface for CouponUsage entity
 * Provides database operations for coupon_usage table
 */
@Repository
public interface CouponUsageRepository extends JpaRepository<CouponUsage, Long> {
    
    /**
     * Check if customer has used a specific coupon
     */
    boolean existsByCustomerIdAndCouponCode(Long customerId, String couponCode);
    
    /**
     * Find all coupon usages for a customer
     */
    List<CouponUsage> findByCustomerId(Long customerId);
    
    /**
     * Count how many times a coupon was used
     */
    long countByCouponCode(String couponCode);
}
