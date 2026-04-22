package com.savadhika.repository;

import com.savadhika.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for Transaction entity
 * Provides database operations for cust_mass_trans table
 */
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    /**
     * Find all transactions for a customer
     */
    List<Transaction> findByCustomerId(Long customerId);
    
    /**
     * Find transactions by date range
     */
    List<Transaction> findByDateTransactionBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find transactions with coupon code
     */
    List<Transaction> findByCouponCodeIsNotNull();
    
    /**
     * Get total revenue for a date range
     */
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.dateTransaction BETWEEN :startDate AND :endDate")
    Double getTotalRevenue(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
