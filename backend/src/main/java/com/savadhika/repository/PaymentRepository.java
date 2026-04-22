package com.savadhika.repository;

import com.savadhika.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository interface for Payment entity
 * Provides database operations for customer_payments table
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    /**
     * Find all payments for a customer
     */
    List<Payment> findByCustomerId(Long customerId);
    
    /**
     * Find payment by transaction ID
     */
    Payment findByTransactionId(Long transactionId);
}
