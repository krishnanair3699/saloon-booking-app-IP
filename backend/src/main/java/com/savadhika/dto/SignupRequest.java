package com.savadhika.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
public class SignupRequest {
    @NotBlank(message = "Name is required") @Size(min = 2, max = 100) private String name;
    @NotBlank(message = "Email is required") @Email private String email;
    @NotBlank(message = "Phone is required") @Size(min = 10, max = 15) private String phone;
    @NotBlank(message = "Password is required") @Size(min = 6) private String password;
    private String city;
    public SignupRequest() {}
    public String getName() { return name; } public void setName(String v) { this.name = v; }
    public String getEmail() { return email; } public void setEmail(String v) { this.email = v; }
    public String getPhone() { return phone; } public void setPhone(String v) { this.phone = v; }
    public String getPassword() { return password; } public void setPassword(String v) { this.password = v; }
    public String getCity() { return city; } public void setCity(String v) { this.city = v; }
}
