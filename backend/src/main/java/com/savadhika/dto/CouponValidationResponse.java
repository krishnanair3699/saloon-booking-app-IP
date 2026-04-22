package com.savadhika.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for coupon validation response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponValidationResponse {
    private Boolean valid;
    private String message;
    private Double discountPercentage;
    private Double discountAmount;
    private Double finalAmount;
}
