package com.savadhika.dto;

import java.util.List;

public class MISReportResponse {
    private List<BookingData> bookings;
    private Integer totalBookings;
    private Double totalRevenue;

    public MISReportResponse() {}

    public List<BookingData> getBookings() { return bookings; }
    public void setBookings(List<BookingData> bookings) { this.bookings = bookings; }
    public Integer getTotalBookings() { return totalBookings; }
    public void setTotalBookings(Integer totalBookings) { this.totalBookings = totalBookings; }
    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }

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

        public BookingData() {}

        public Long getTrans_id() { return trans_id; }
        public void setTrans_id(Long trans_id) { this.trans_id = trans_id; }
        public String getBooking_date() { return booking_date; }
        public void setBooking_date(String booking_date) { this.booking_date = booking_date; }
        public String getCustomer_name() { return customer_name; }
        public void setCustomer_name(String customer_name) { this.customer_name = customer_name; }
        public String getCustomer_email() { return customer_email; }
        public void setCustomer_email(String customer_email) { this.customer_email = customer_email; }
        public String getCustomer_phone() { return customer_phone; }
        public void setCustomer_phone(String customer_phone) { this.customer_phone = customer_phone; }
        public String getMassage_name() { return massage_name; }
        public void setMassage_name(String massage_name) { this.massage_name = massage_name; }
        public String getMassage_type() { return massage_type; }
        public void setMassage_type(String massage_type) { this.massage_type = massage_type; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public Double getMassage_price() { return massage_price; }
        public void setMassage_price(Double massage_price) { this.massage_price = massage_price; }
        public String getBooking_time() { return booking_time; }
        public void setBooking_time(String booking_time) { this.booking_time = booking_time; }
    }
}
