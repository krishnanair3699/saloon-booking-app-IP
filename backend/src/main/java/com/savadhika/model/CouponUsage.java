package com.savadhika.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Coupon Usage Entity - Tracks coupon usage by customers
 * Maps to coupon_usage table in Supabase PostgreSQL database
 */
@Entity
@Table(name = "coupon_usage")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponUsage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usage_id")
    private Long usageId;
    
    @Column(name = "custid", nullable = false)
    private Long customerId;
    
    @Column(name = "coupon_code", nullable = false, length = 50)
    private String couponCode;
    
    @Column(name = "trans_id")
    private Long transactionId;
    
    @Column(name = "discount_amount")
    private Double discountAmount;
    
    @Column(name = "used_at")
    private LocalDateTime usedAt;
    
    @PrePersist
    protected void onCreate() {
        if (usedAt == null) {
            usedAt = LocalDateTime.now();
        }
    }
}
