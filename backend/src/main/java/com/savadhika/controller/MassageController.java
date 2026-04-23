package com.savadhika.controller;

import com.savadhika.model.Massage;
import com.savadhika.service.MassageService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller for massage/therapy endpoints
 * Handles CRUD operations for massage services
 */
@RestController
@RequestMapping("/massages")


public class MassageController {
    
    @org.springframework.beans.factory.annotation.Autowired
    private MassageService massageService;
    
    /**
     * GET /massages
     * Get all massages, optionally filtered by type and city
     */
    @GetMapping
    public ResponseEntity<List<Massage>> getAllMassages(
            @RequestParam(required = false) String massageType,
            @RequestParam(required = false) String city
    ) {
        List<Massage> massages = massageService.getMassagesByTypeAndCity(massageType, city);
        return ResponseEntity.ok(massages);
    }
    
    /**
     * GET /massages/{id}
     * Get a specific massage by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getMassageById(@PathVariable Long id) {
        try {
            Massage massage = massageService.getMassageById(id);
            return ResponseEntity.ok(massage);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * POST /massages (Admin only)
     * Create a new massage service
     */
    @PostMapping
    public ResponseEntity<?> createMassage(@RequestBody Massage massage) {
        try {
            Massage created = massageService.createMassage(massage);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ErrorResponse(e.getMessage())
            );
        }
    }
    
    /**
     * PUT /massages/{id} (Admin only)
     * Update an existing massage
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMassage(
            @PathVariable Long id,
            @RequestBody Massage massage
    ) {
        try {
            Massage updated = massageService.updateMassage(id, massage);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ErrorResponse(e.getMessage())
            );
        }
    }
    
    /**
     * DELETE /massages/{id} (Admin only)
     * Delete a massage
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMassage(@PathVariable Long id) {
        try {
            massageService.deleteMassage(id);
            return ResponseEntity.ok(new SuccessResponse("Massage deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ErrorResponse(e.getMessage())
            );
        }
    }
    
    record ErrorResponse(String error) {}
    record SuccessResponse(String message) {}
}
