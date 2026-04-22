package com.savadhika.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for payment processing
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private Long customerId;
    private Long massageId;
    private String paymentMethod;
    private String paymentDetails;
    private Double amount;
    private String couponCode;
}
