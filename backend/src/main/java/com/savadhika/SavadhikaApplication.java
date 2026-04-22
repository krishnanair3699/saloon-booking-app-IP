package com.savadhika;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * SAVADHIKA Spa Booking Portal - Main Application Class
 * 
 * This is the entry point for the Spring Boot application.
 * It handles the spa and saloon booking system with features like:
 * - Customer authentication and management
 * - Massage/therapy booking
 * - Payment processing with coupon codes
 * - Admin dashboard and MIS reports
 * 
 * @author SAVADHIKA Team
 * @version 1.0.0
 */
@SpringBootApplication
public class SavadhikaApplication {

    public static void main(String[] args) {
        SpringApplication.run(SavadhikaApplication.class, args);
        System.out.println("================================");
        System.out.println("SAVADHIKA Spa Booking Backend");
        System.out.println("Server running on: http://localhost:8080/api");
        System.out.println("================================");
    }

    /**
     * Configure CORS to allow requests from React frontend
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                            "http://localhost:5173",
                            "http://localhost:3000",
                            "https://app-*.figma.site",
                            "https://app-*.makeproxy-c.figma.site"
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
