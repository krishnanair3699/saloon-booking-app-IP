package com.savadhika.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "coupon_usage")
public class CouponUsage {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "usage_id") private Long usageId;
    @Column(name = "custid", nullable = false) private Long customerId;
    @Column(name = "coupon_code", nullable = false, length = 50) private String couponCode;
    @Column(name = "trans_id") private Long transactionId;
    @Column(name = "discount_amount") private Double discountAmount;
    @Column(name = "used_at") private LocalDateTime usedAt;
    @PrePersist protected void onCreate() { if (usedAt == null) usedAt = LocalDateTime.now(); }
    public CouponUsage() {}
    public Long getUsageId() { return usageId; } public void setUsageId(Long v) { this.usageId = v; }
    public Long getCustomerId() { return customerId; } public void setCustomerId(Long v) { this.customerId = v; }
    public String getCouponCode() { return couponCode; } public void setCouponCode(String v) { this.couponCode = v; }
    public Long getTransactionId() { return transactionId; } public void setTransactionId(Long v) { this.transactionId = v; }
    public Double getDiscountAmount() { return discountAmount; } public void setDiscountAmount(Double v) { this.discountAmount = v; }
    public LocalDateTime getUsedAt() { return usedAt; } public void setUsedAt(LocalDateTime v) { this.usedAt = v; }
}
