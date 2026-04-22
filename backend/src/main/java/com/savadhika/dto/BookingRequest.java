package com.savadhika.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating a booking
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    private Long customerId;
    private Long massageId;
    private String bookingDate;
    private String bookingTime;
}
