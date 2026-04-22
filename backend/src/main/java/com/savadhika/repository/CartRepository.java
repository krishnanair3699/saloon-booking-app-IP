package com.savadhika.repository;

import com.savadhika.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository interface for Cart entity
 * Provides database operations for cart_master table
 */
@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    
    /**
     * Find all cart items for a customer
     */
    List<Cart> findByCustomerId(Long customerId);
    
    /**
     * Delete all cart items for a customer
     */
    void deleteByCustomerId(Long customerId);
    
    /**
     * Count cart items for a customer
     */
    long countByCustomerId(Long customerId);
}
