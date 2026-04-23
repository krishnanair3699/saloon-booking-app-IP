package com.savadhika.dto;
public class PaymentRequest {
    private Long customerId;
    private Long massageId;
    private Long transactionId;
    private String paymentMethod;
    private String paymentDetails;
    private Double amount;
    private String couponCode;
    public PaymentRequest() {}
    public Long getCustomerId() { return customerId; } public void setCustomerId(Long v) { this.customerId = v; }
    public Long getMassageId() { return massageId; } public void setMassageId(Long v) { this.massageId = v; }
    public Long getTransactionId() { return transactionId; } public void setTransactionId(Long v) { this.transactionId = v; }
    public String getPaymentMethod() { return paymentMethod; } public void setPaymentMethod(String v) { this.paymentMethod = v; }
    public String getPaymentDetails() { return paymentDetails; } public void setPaymentDetails(String v) { this.paymentDetails = v; }
    public Double getAmount() { return amount; } public void setAmount(Double v) { this.amount = v; }
    public String getCouponCode() { return couponCode; } public void setCouponCode(String v) { this.couponCode = v; }
}
