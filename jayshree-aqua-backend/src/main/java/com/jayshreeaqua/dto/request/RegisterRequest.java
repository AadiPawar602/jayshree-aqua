package com.jayshreeaqua.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank @Size(min=2, max=100)
    private String fullName;

    @NotBlank @Email
    private String email;

    @NotBlank @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit Indian mobile number")
    private String phone;

    @NotBlank @Size(min=8, message="Password must be at least 8 characters")
    private String password;

    private String addressLine1;
    private String addressLine2;
    private String city;
    private String pincode;
}
