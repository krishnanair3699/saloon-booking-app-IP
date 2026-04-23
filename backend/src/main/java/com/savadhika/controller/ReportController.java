package com.savadhika.controller;

import com.savadhika.dto.MISReportResponse;
import com.savadhika.service.ReportService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/**
 * REST Controller for report endpoints
 * Handles MIS reports and analytics
 */
@RestController
@RequestMapping("/reports")

@CrossOrigin(origins = "*")
public class ReportController {
    
    @org.springframework.beans.factory.annotation.Autowired
    private ReportService reportService;
    
    /**
     * POST /reports/mis
     * Generate MIS report for a date range
     */
    @PostMapping("/mis")
    public ResponseEntity<?> generateMISReport(@RequestBody Map<String, String> request) {
        try {
            String startDate = request.get("startDate");
            String endDate = request.get("endDate");
            
            MISReportResponse report = reportService.generateMISReport(startDate, endDate);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", e.getMessage())
            );
        }
    }
    
    /**
     * GET /reports/booking-history/{customerId}
     * Get booking history for a customer
     */
    @GetMapping("/booking-history/{customerId}")
    public ResponseEntity<?> getBookingHistory(@PathVariable Long customerId) {
        try {
            var history = reportService.getBookingHistory(customerId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "bookings", history
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", e.getMessage())
            );
        }
    }
}
