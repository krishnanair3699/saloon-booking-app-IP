# Spring Boot Backend Setup Guide

Step-by-step guide to create the backend for your Savadhika Thai Massage Booking System.

---

## 📋 Prerequisites

- Java 17 or higher
- Maven or Gradle
- MySQL or PostgreSQL database
- IntelliJ IDEA or Eclipse (recommended)
- Postman (for API testing)

---

## 🚀 Step 1: Create Spring Boot Project

### Option A: Using Spring Initializr (Recommended)

1. Go to https://start.spring.io/
2. Configure project:
   - **Project:** Maven
   - **Language:** Java
   - **Spring Boot:** 3.2.x (latest stable)
   - **Group:** com.savadhika
   - **Artifact:** massage-booking
   - **Name:** massage-booking
   - **Package name:** com.savadhika.massage
   - **Packaging:** Jar
   - **Java:** 17

3. Add dependencies:
   - Spring Web
   - Spring Data JPA
   - MySQL Driver (or PostgreSQL Driver)
   - Spring Security
   - Lombok
   - Validation

4. Click **Generate** and download the ZIP file
5. Extract and open in your IDE

### Option B: Using Maven Command Line

```bash
mvn archetype:generate \
  -DgroupId=com.savadhika \
  -DartifactId=massage-booking \
  -DarchetypeArtifactId=maven-archetype-quickstart \
  -DinteractiveMode=false
```

---

## 📦 Step 2: Add Dependencies

Edit `pom.xml` and add these dependencies:

```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Spring Boot Starter Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- MySQL Driver -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Spring Security (for JWT) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <!-- JWT Library -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.3</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>

    <!-- Lombok (reduces boilerplate) -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <!-- Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- Spring Boot DevTools (auto-reload) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
        <optional>true</optional>
    </dependency>
</dependencies>
```

---

## ⚙️ Step 3: Configure application.properties

Create/edit `src/main/resources/application.properties`:

```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Database Configuration (MySQL)
spring.datasource.url=jdbc:mysql://localhost:3306/savadhika_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
jwt.secret=YourSuperSecretKeyForJWTTokenGenerationMustBe256BitsLong12345
jwt.expiration=86400000

# CORS Configuration
cors.allowed-origins=http://localhost:5173,https://your-frontend.vercel.app

# Logging
logging.level.com.savadhika=DEBUG
logging.level.org.springframework.security=DEBUG
```

**For PostgreSQL**, use:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/savadhika_db
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

---

## 🗄️ Step 4: Create Database Schema

Run this SQL in MySQL Workbench or your database client:

```sql
CREATE DATABASE IF NOT EXISTS savadhika_db;
USE savadhika_db;

-- Customer Master Table
CREATE TABLE customer_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customername VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile_no VARCHAR(20) NOT NULL,
    city VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    confirmpassword VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Massage Master Table
CREATE TABLE massage_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    massagename VARCHAR(255) NOT NULL,
    massagetype VARCHAR(100) NOT NULL,
    duration INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    massagezone VARCHAR(100) NOT NULL,
    Description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart Master Table
CREATE TABLE cart_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerid INT NOT NULL,
    massageid INT NOT NULL,
    quantity INT DEFAULT 1,
    amount DECIMAL(10,2),
    transactiondate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customerid) REFERENCES customer_master(id) ON DELETE CASCADE,
    FOREIGN KEY (massageid) REFERENCES massage_master(id) ON DELETE CASCADE
);

-- Customer Massage Transaction Table
CREATE TABLE cust_mass_trans (
    trans_id INT AUTO_INCREMENT PRIMARY KEY,
    custid INT NOT NULL,
    massid INT NOT NULL,
    datetrans TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    coupon_code VARCHAR(50),
    amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (custid) REFERENCES customer_master(id) ON DELETE CASCADE,
    FOREIGN KEY (massid) REFERENCES massage_master(id) ON DELETE CASCADE
);

-- Customer Payments Table
CREATE TABLE customer_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerid INT NOT NULL,
    paymentdetails TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customerid) REFERENCES customer_master(id) ON DELETE CASCADE
);
```

---

## 📂 Step 5: Create Project Structure

Your project should have this structure:

```
src/main/java/com/savadhika/massage/
├── MassageBookingApplication.java
├── config/
│   ├── CorsConfig.java
│   ├── SecurityConfig.java
│   └── JwtConfig.java
├── entity/
│   ├── Customer.java
│   ├── Massage.java
│   ├── Cart.java
│   ├── Transaction.java
│   └── Payment.java
├── repository/
│   ├── CustomerRepository.java
│   ├── MassageRepository.java
│   ├── CartRepository.java
│   ├── TransactionRepository.java
│   └── PaymentRepository.java
├── service/
│   ├── AuthService.java
│   ├── MassageService.java
│   ├── CartService.java
│   ├── PaymentService.java
│   └── TransactionService.java
├── controller/
│   ├── AuthController.java
│   ├── MassageController.java
│   ├── CartController.java
│   ├── PaymentController.java
│   ├── TransactionController.java
│   └── AdminController.java
├── dto/
│   ├── SignupRequest.java
│   ├── SigninRequest.java
│   ├── AuthResponse.java
│   └── ... (other DTOs)
└── util/
    ├── JwtUtil.java
    └── ResponseUtil.java
```

---

## 🔐 Step 6: Create Entity Classes

### Customer.java

```java
package com.savadhika.massage.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_master")
@Data
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String customername;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "mobile_no", nullable = false)
    private String mobileNo;

    private String city;

    @Column(nullable = false)
    private String password;

    private String confirmpassword;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
```

### Massage.java

```java
package com.savadhika.massage.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "massage_master")
@Data
public class Massage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String massagename;

    @Column(nullable = false)
    private String massagetype;

    @Column(nullable = false)
    private Integer duration;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private String massagezone;

    @Column(columnDefinition = "TEXT")
    private String Description;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
```

*(Create similar entity classes for Cart, Transaction, and Payment)*

---

## 🔒 Step 7: Implement JWT Authentication

### JwtUtil.java

```java
package com.savadhika.massage.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(Long userId, String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("email", email);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Long extractUserId(String token) {
        return extractClaims(token).get("userId", Long.class);
    }

    public boolean validateToken(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
```

---

## 🌐 Step 8: Create REST Controllers

### AuthController.java

```java
package com.savadhika.massage.controller;

import com.savadhika.massage.dto.*;
import com.savadhika.massage.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        return authService.signup(request);
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody SigninRequest request) {
        return authService.signin(request);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        return authService.getCurrentUser(token);
    }
}
```

*(Create similar controllers for Massage, Cart, Payment, etc.)*

---

## 🔧 Step 9: Configure CORS

### CorsConfig.java

```java
package com.savadhika.massage.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173", "https://your-frontend.com")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
```

---

## ▶️ Step 10: Run the Application

```bash
mvn spring-boot:run
```

Or run `MassageBookingApplication.java` from your IDE.

The server will start at: **http://localhost:8080/api**

---

## 🧪 Step 11: Test with Postman

Test the signup endpoint:

```
POST http://localhost:8080/api/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User",
  "phone": "9876543210",
  "city": "Mumbai"
}
```

---

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [JWT with Spring Boot](https://www.baeldung.com/spring-security-oauth-jwt)
- [MySQL Tutorial](https://dev.mysql.com/doc/)

---

## ✅ Next Steps

1. Complete all entity classes
2. Create repository interfaces
3. Implement service layer
4. Create all REST controllers
5. Test all endpoints
6. Connect frontend to backend
7. Deploy to Heroku/Railway/AWS

Good luck! 🚀
