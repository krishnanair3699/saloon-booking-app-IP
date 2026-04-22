package com.savadhika.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Customer Entity - Represents a customer in the system
 * Maps to customer_master table in Supabase PostgreSQL database
 */
@Entity
@Table(name = "customer_master")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "custid")
    private Long customerId;
    
    @Column(name = "custname", nullable = false, length = 100)
    private String customerName;
    
    @Column(name = "custemail", nullable = false, unique = true, length = 100)
    private String customerEmail;
    
    @Column(name = "custphone", nullable = false, length = 15)
    private String customerPhone;
    
    @Column(name = "custpassword", nullable = false)
    private String customerPassword;
    
    @Column(name = "createdat")
    private LocalDateTime createdAt;
    
    @Column(name = "isadmin")
    private Boolean isAdmin = false;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (isAdmin == null) {
            isAdmin = false;
        }
    }
}
