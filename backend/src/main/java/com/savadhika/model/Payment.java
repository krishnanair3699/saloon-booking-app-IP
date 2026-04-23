package com.savadhika.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "customer_payments")
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "payment_id") private Long paymentId;
    @Column(name = "custid", nullable = false) private Long customerId;
    @Column(name = "trans_id") private Long transactionId;
    @Column(name = "payment_method", nullable = false, length = 50) private String paymentMethod;
    @Column(name = "payment_details", columnDefinition = "TEXT") private String paymentDetails;
    @Column(name = "amount", nullable = false) private Double amount;
    @Column(name = "payment_date") private LocalDateTime paymentDate;
    @PrePersist protected void onCreate() { if (paymentDate == null) paymentDate = LocalDateTime.now(); }
    public Payment() {}
    public Long getPaymentId() { return paymentId; } public void setPaymentId(Long v) { this.paymentId = v; }
    public Long getCustomerId() { return customerId; } public void setCustomerId(Long v) { this.customerId = v; }
    public Long getTransactionId() { return transactionId; } public void setTransactionId(Long v) { this.transactionId = v; }
    public String getPaymentMethod() { return paymentMethod; } public void setPaymentMethod(String v) { this.paymentMethod = v; }
    public String getPaymentDetails() { return paymentDetails; } public void setPaymentDetails(String v) { this.paymentDetails = v; }
    public Double getAmount() { return amount; } public void setAmount(Double v) { this.amount = v; }
    public LocalDateTime getPaymentDate() { return paymentDate; } public void setPaymentDate(LocalDateTime v) { this.paymentDate = v; }
}
