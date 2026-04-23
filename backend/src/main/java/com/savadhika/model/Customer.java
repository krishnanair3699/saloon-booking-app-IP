package com.savadhika.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "customer_master")
public class Customer {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "custid") private Long customerId;
    @Column(name = "custname", nullable = false, length = 100) private String customerName;
    @Column(name = "custemail", nullable = false, unique = true, length = 100) private String customerEmail;
    @Column(name = "custphone", nullable = false, length = 15) private String customerPhone;
    @Column(name = "custpassword", nullable = false) private String customerPassword;
    @Column(name = "createdat") private LocalDateTime createdAt;
    @Column(name = "isadmin") private Boolean isAdmin = false;
    @PrePersist protected void onCreate() { if (createdAt == null) createdAt = LocalDateTime.now(); if (isAdmin == null) isAdmin = false; }
    public Customer() {}
    public Long getCustomerId() { return customerId; } public void setCustomerId(Long v) { this.customerId = v; }
    public String getCustomerName() { return customerName; } public void setCustomerName(String v) { this.customerName = v; }
    public String getCustomerEmail() { return customerEmail; } public void setCustomerEmail(String v) { this.customerEmail = v; }
    public String getCustomerPhone() { return customerPhone; } public void setCustomerPhone(String v) { this.customerPhone = v; }
    public String getCustomerPassword() { return customerPassword; } public void setCustomerPassword(String v) { this.customerPassword = v; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
    public Boolean getIsAdmin() { return isAdmin; } public void setIsAdmin(Boolean v) { this.isAdmin = v; }
}
