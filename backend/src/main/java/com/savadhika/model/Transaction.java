package com.savadhika.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Transaction Entity - Represents a booking transaction
 * Maps to cust_mass_trans table in Supabase PostgreSQL database
 */
@Entity
@Table(name = "cust_mass_trans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trans_id")
    private Long transactionId;
    
    @Column(name = "custid", nullable = false)
    private Long customerId;
    
    @Column(name = "massid", nullable = false)
    private Long massageId;
    
    @Column(name = "datetrans")
    private LocalDateTime dateTransaction;
    
    @Column(name = "coupon_code", length = 50)
    private String couponCode;
    
    @Column(name = "amount")
    private Double amount;
    
    @PrePersist
    protected void onCreate() {
        if (dateTransaction == null) {
            dateTransaction = LocalDateTime.now();
        }
    }
}
