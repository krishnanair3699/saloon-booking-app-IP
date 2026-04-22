package com.savadhika.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Massage Entity - Represents a massage/therapy service
 * Maps to massage_master table in Supabase PostgreSQL database
 */
@Entity
@Table(name = "massage_master")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Massage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "massid")
    private Long massageId;
    
    @Column(name = "massname", nullable = false, length = 200)
    private String massageName;
    
    @Column(name = "massdesc", columnDefinition = "TEXT")
    private String massageDescription;
    
    @Column(name = "masstype", nullable = false, length = 50)
    private String massageType; // e.g., "Head & Shoulders", "Full Body", etc.
    
    @Column(name = "massprice", nullable = false)
    private Double massagePrice;
    
    @Column(name = "massduration")
    private Integer massageDuration; // in minutes
    
    @Column(name = "masszone", nullable = false, length = 50)
    private String massageZone; // City: Mumbai or Delhi
    
    @Column(name = "createdat")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
