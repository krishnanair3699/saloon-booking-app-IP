package com.savadhika.repository;

import com.savadhika.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository interface for Customer entity
 * Provides database operations for customer_master table
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    /**
     * Find customer by email
     */
    Optional<Customer> findByCustomerEmail(String email);
    
    /**
     * Check if email already exists
     */
    boolean existsByCustomerEmail(String email);
    
    /**
     * Check if phone already exists
     */
    boolean existsByCustomerPhone(String phone);
}
