package com.savadhika.dto;
public class AuthRequest {
    private String email;
    private String password;
    public AuthRequest() {}
    public String getEmail() { return email; } public void setEmail(String v) { this.email = v; }
    public String getPassword() { return password; } public void setPassword(String v) { this.password = v; }
}
