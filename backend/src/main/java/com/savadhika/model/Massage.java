package com.savadhika.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "massage_master")
public class Massage {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "massid") private Long massageId;
    @Column(name = "massname", nullable = false, length = 200) private String massageName;
    @Column(name = "massdesc", columnDefinition = "TEXT") private String massageDescription;
    @Column(name = "masstype", nullable = false, length = 50) private String massageType;
    @Column(name = "massprice", nullable = false) private Double massagePrice;
    @Column(name = "massduration") private Integer massageDuration;
    @Column(name = "masszone", nullable = false, length = 50) private String massageZone;
    @Column(name = "createdat") private LocalDateTime createdAt;
    @PrePersist protected void onCreate() { if (createdAt == null) createdAt = LocalDateTime.now(); }
    public Massage() {}
    public Long getMassageId() { return massageId; } public void setMassageId(Long v) { this.massageId = v; }
    public String getMassageName() { return massageName; } public void setMassageName(String v) { this.massageName = v; }
    public String getMassageDescription() { return massageDescription; } public void setMassageDescription(String v) { this.massageDescription = v; }
    public String getMassageType() { return massageType; } public void setMassageType(String v) { this.massageType = v; }
    public Double getMassagePrice() { return massagePrice; } public void setMassagePrice(Double v) { this.massagePrice = v; }
    public Integer getMassageDuration() { return massageDuration; } public void setMassageDuration(Integer v) { this.massageDuration = v; }
    public String getMassageZone() { return massageZone; } public void setMassageZone(String v) { this.massageZone = v; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
}
