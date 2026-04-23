package com.savadhika.dto;
public class AuthResponse {
    private String access_token;
    private String email;
    private String name;
    private Long id;
    private Boolean is_admin;
    private String message;

    public AuthResponse() {}
    public AuthResponse(String access_token, String email, String name, Long id, Boolean is_admin, String message) {
        this.access_token = access_token;
        this.email = email;
        this.name = name;
        this.id = id;
        this.is_admin = is_admin;
        this.message = message;
    }
    public String getAccess_token() { return access_token; } public void setAccess_token(String v) { this.access_token = v; }
    public String getEmail() { return email; } public void setEmail(String v) { this.email = v; }
    public String getName() { return name; } public void setName(String v) { this.name = v; }
    public Long getId() { return id; } public void setId(Long v) { this.id = v; }
    public Boolean getIs_admin() { return is_admin; } public void setIs_admin(Boolean v) { this.is_admin = v; }
    public String getMessage() { return message; } public void setMessage(String v) { this.message = v; }
}
