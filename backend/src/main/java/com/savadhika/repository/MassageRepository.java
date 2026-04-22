package com.savadhika.repository;

import com.savadhika.model.Massage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository interface for Massage entity
 * Provides database operations for massage_master table
 */
@Repository
public interface MassageRepository extends JpaRepository<Massage, Long> {
    
    /**
     * Find massages by type (e.g., "Head & Shoulders", "Full Body")
     */
    List<Massage> findByMassageType(String massageType);
    
    /**
     * Find massages by city/zone
     */
    List<Massage> findByMassageZone(String massageZone);
    
    /**
     * Find massages by type and zone
     */
    List<Massage> findByMassageTypeAndMassageZone(String massageType, String massageZone);
    
    /**
     * Find massages within price range
     */
    List<Massage> findByMassagePriceBetween(Double minPrice, Double maxPrice);
}
