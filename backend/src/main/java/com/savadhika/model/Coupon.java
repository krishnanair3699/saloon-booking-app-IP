package com.savadhika.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupon_master")
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "coupon_id")
    private Long couponId;

    @Column(name = "coupon_code", nullable = false, unique = true, length = 50)
    private String couponCode;

    @Column(name = "discount_percentage", nullable = false)
    private Double discountPercentage;

    @Column(name = "max_discount_amount")
    private Double maxDiscountAmount;

    @Column(name = "valid_from")
    private LocalDateTime validFrom;

    @Column(name = "valid_until")
    private LocalDateTime validUntil;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "createdat")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (isActive == null) isActive = true;
    }

    public Coupon() {}

    public Long getCouponId() { return couponId; }
    public void setCouponId(Long couponId) { this.couponId = couponId; }
    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }
    public Double getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(Double discountPercentage) { this.discountPercentage = discountPercentage; }
    public Double getMaxDiscountAmount() { return maxDiscountAmount; }
    public void setMaxDiscountAmount(Double maxDiscountAmount) { this.maxDiscountAmount = maxDiscountAmount; }
    public LocalDateTime getValidFrom() { return validFrom; }
    public void setValidFrom(LocalDateTime validFrom) { this.validFrom = validFrom; }
    public LocalDateTime getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDateTime validUntil) { this.validUntil = validUntil; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
