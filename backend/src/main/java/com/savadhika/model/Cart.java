package com.savadhika.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Cart Entity - Represents items in customer's shopping cart
 * Maps to cart_master table in Supabase PostgreSQL database
 */
@Entity
@Table(name = "cart_master")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cart {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Long cartId;
    
    @Column(name = "custid", nullable = false)
    private Long customerId;
    
    @Column(name = "massid", nullable = false)
    private Long massageId;
    
    @Column(name = "booking_date")
    private String bookingDate;
    
    @Column(name = "booking_time", length = 10)
    private String bookingTime;
    
    @Column(name = "createdat")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
