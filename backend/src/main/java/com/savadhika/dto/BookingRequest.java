package com.savadhika.dto;

public class BookingRequest {
    private Long customerId;
    private Long massageId;
    private String bookingDate;
    private String bookingTime;

    public BookingRequest() {}

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public Long getMassageId() { return massageId; }
    public void setMassageId(Long massageId) { this.massageId = massageId; }
    public String getBookingDate() { return bookingDate; }
    public void setBookingDate(String bookingDate) { this.bookingDate = bookingDate; }
    public String getBookingTime() { return bookingTime; }
    public void setBookingTime(String bookingTime) { this.bookingTime = bookingTime; }
}
