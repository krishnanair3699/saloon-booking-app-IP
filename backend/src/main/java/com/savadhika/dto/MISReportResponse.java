package com.savadhika.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * DTO for MIS Report data
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MISReportResponse {
    private List<BookingData> bookings;
    private Integer totalBookings;
    private Double totalRevenue;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookingData {
        private Long trans_id;
        private String booking_date;
        private String customer_name;
        private String customer_email;
        private String customer_phone;
        private String massage_name;
        private String massage_type;
        private String city;
        private Double massage_price;
        private String booking_time;
    }
}
