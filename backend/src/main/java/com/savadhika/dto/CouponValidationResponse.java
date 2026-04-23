package com.savadhika.dto;

public class CouponValidationResponse {
    private Boolean valid;
    private String message;
    private Double discountPercentage;
    private Double discountAmount;
    private Double finalAmount;

    public CouponValidationResponse() {}

    public CouponValidationResponse(Boolean valid, String message, Double discountPercentage, Double discountAmount, Double finalAmount) {
        this.valid = valid;
        this.message = message;
        this.discountPercentage = discountPercentage;
        this.discountAmount = discountAmount;
        this.finalAmount = finalAmount;
    }

    public Boolean getValid() { return valid; }
    public void setValid(Boolean valid) { this.valid = valid; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Double getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(Double discountPercentage) { this.discountPercentage = discountPercentage; }
    public Double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(Double discountAmount) { this.discountAmount = discountAmount; }
    public Double getFinalAmount() { return finalAmount; }
    public void setFinalAmount(Double finalAmount) { this.finalAmount = finalAmount; }
}
