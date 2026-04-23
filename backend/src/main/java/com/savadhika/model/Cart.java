package com.savadhika.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "cart_master")
public class Cart {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "cart_id") private Long cartId;
    @Column(name = "custid", nullable = false) private Long customerId;
    @Column(name = "massid", nullable = false) private Long massageId;
    @Column(name = "booking_date") private String bookingDate;
    @Column(name = "booking_time", length = 10) private String bookingTime;
    @Column(name = "createdat") private LocalDateTime createdAt;
    @PrePersist protected void onCreate() { if (createdAt == null) createdAt = LocalDateTime.now(); }
    public Cart() {}
    public Long getCartId() { return cartId; } public void setCartId(Long v) { this.cartId = v; }
    public Long getCustomerId() { return customerId; } public void setCustomerId(Long v) { this.customerId = v; }
    public Long getMassageId() { return massageId; } public void setMassageId(Long v) { this.massageId = v; }
    public String getBookingDate() { return bookingDate; } public void setBookingDate(String v) { this.bookingDate = v; }
    public String getBookingTime() { return bookingTime; } public void setBookingTime(String v) { this.bookingTime = v; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
}
