package com.savadhika.service;

import com.savadhika.model.Massage;
import com.savadhika.repository.MassageRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Service for handling massage/therapy operations
 * Business logic for massage management
 */
@Service

public class MassageService {
    
    @org.springframework.beans.factory.annotation.Autowired
    private MassageRepository massageRepository;
    
    /**
     * Get all massages
     */
    public List<Massage> getAllMassages() {
        return massageRepository.findAll();
    }
    
    /**
     * Get massage by ID
     */
    public Massage getMassageById(Long id) {
        return massageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Massage not found with id: " + id));
    }
    
    /**
     * Get massages by type and city
     */
    public List<Massage> getMassagesByTypeAndCity(String massageType, String city) {
        if (massageType != null && city != null) {
            return massageRepository.findByMassageTypeAndMassageZone(massageType, city);
        } else if (massageType != null) {
            return massageRepository.findByMassageType(massageType);
        } else if (city != null) {
            return massageRepository.findByMassageZone(city);
        } else {
            return massageRepository.findAll();
        }
    }
    
    /**
     * Create new massage (Admin only)
     */
    @Transactional
    public Massage createMassage(Massage massage) {
        return massageRepository.save(massage);
    }
    
    /**
     * Update massage (Admin only)
     */
    @Transactional
    public Massage updateMassage(Long id, Massage massageDetails) {
        Massage massage = getMassageById(id);
        
        massage.setMassageName(massageDetails.getMassageName());
        massage.setMassageDescription(massageDetails.getMassageDescription());
        massage.setMassageType(massageDetails.getMassageType());
        massage.setMassagePrice(massageDetails.getMassagePrice());
        massage.setMassageDuration(massageDetails.getMassageDuration());
        massage.setMassageZone(massageDetails.getMassageZone());
        
        return massageRepository.save(massage);
    }
    
    /**
     * Delete massage (Admin only)
     */
    @Transactional
    public void deleteMassage(Long id) {
        Massage massage = getMassageById(id);
        massageRepository.delete(massage);
    }
}
