package com.savadhika.service;

import com.savadhika.dto.MISReportResponse;
import com.savadhika.dto.MISReportResponse.BookingData;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

/**
 * Service for generating MIS reports
 * Business intelligence and analytics
 */
@Service
@RequiredArgsConstructor
public class ReportService {
    
    private final JdbcTemplate jdbcTemplate;
    
    /**
     * Generate MIS Report for a date range
     * Joins multiple tables to provide comprehensive booking information
     */
    public MISReportResponse generateMISReport(String startDate, String endDate) {
        String sql = """
            SELECT 
                t.trans_id,
                t.datetrans::date as booking_date,
                c.custname as customer_name,
                c.custemail as customer_email,
                c.custphone as customer_phone,
                m.massname as massage_name,
                m.masstype as massage_type,
                m.masszone as city,
                t.amount as massage_price,
                cart.booking_time
            FROM cust_mass_trans t
            JOIN customer_master c ON t.custid = c.custid
            JOIN massage_master m ON t.massid = m.massid
            LEFT JOIN cart_master cart ON cart.custid = t.custid AND cart.massid = t.massid
            WHERE t.datetrans::date BETWEEN ?::date AND ?::date
            ORDER BY t.datetrans DESC
        """;
        
        List<BookingData> bookings = jdbcTemplate.query(
            sql,
            new Object[]{startDate, endDate},
            (rs, rowNum) -> {
                BookingData booking = new BookingData();
                booking.setTrans_id(rs.getLong("trans_id"));
                booking.setBooking_date(rs.getString("booking_date"));
                booking.setCustomer_name(rs.getString("customer_name"));
                booking.setCustomer_email(rs.getString("customer_email"));
                booking.setCustomer_phone(rs.getString("customer_phone"));
                booking.setMassage_name(rs.getString("massage_name"));
                booking.setMassage_type(rs.getString("massage_type"));
                booking.setCity(rs.getString("city"));
                booking.setMassage_price(rs.getDouble("massage_price"));
                booking.setBooking_time(rs.getString("booking_time"));
                return booking;
            }
        );
        
        // Calculate totals
        Integer totalBookings = bookings.size();
        Double totalRevenue = bookings.stream()
            .mapToDouble(BookingData::getMassage_price)
            .sum();
        
        MISReportResponse response = new MISReportResponse();
        response.setBookings(bookings);
        response.setTotalBookings(totalBookings);
        response.setTotalRevenue(totalRevenue);
        
        return response;
    }
    
    /**
     * Get booking history for a customer
     */
    public List<Map<String, Object>> getBookingHistory(Long customerId) {
        String sql = """
            SELECT 
                t.trans_id,
                t.datetrans,
                m.massname,
                m.masstype,
                m.masszone,
                t.amount,
                t.coupon_code,
                p.payment_method
            FROM cust_mass_trans t
            JOIN massage_master m ON t.massid = m.massid
            LEFT JOIN customer_payments p ON p.trans_id = t.trans_id
            WHERE t.custid = ?
            ORDER BY t.datetrans DESC
        """;
        
        return jdbcTemplate.queryForList(sql, customerId);
    }
}
