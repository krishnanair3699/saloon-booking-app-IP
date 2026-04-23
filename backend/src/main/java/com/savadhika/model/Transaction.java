package com.savadhika.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "cust_mass_trans")
public class Transaction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "trans_id") private Long transactionId;
    @Column(name = "custid", nullable = false) private Long customerId;
    @Column(name = "massid", nullable = false) private Long massageId;
    @Column(name = "datetrans") private LocalDateTime dateTransaction;
    @Column(name = "coupon_code", length = 50) private String couponCode;
    @Column(name = "amount") private Double amount;
    @PrePersist protected void onCreate() { if (dateTransaction == null) dateTransaction = LocalDateTime.now(); }
    public Transaction() {}
    public Long getTransactionId() { return transactionId; } public void setTransactionId(Long v) { this.transactionId = v; }
    public Long getCustomerId() { return customerId; } public void setCustomerId(Long v) { this.customerId = v; }
    public Long getMassageId() { return massageId; } public void setMassageId(Long v) { this.massageId = v; }
    public LocalDateTime getDateTransaction() { return dateTransaction; } public void setDateTransaction(LocalDateTime v) { this.dateTransaction = v; }
    public String getCouponCode() { return couponCode; } public void setCouponCode(String v) { this.couponCode = v; }
    public Double getAmount() { return amount; } public void setAmount(Double v) { this.amount = v; }
}
