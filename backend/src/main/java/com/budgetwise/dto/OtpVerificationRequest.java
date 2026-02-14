package com.budgetwise.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OtpVerificationRequest {
    
    @Email(message = "Valid email is required")
    @NotBlank(message = "Email is required")
    private String email;
    
    @NotBlank(message = "OTP is required")
    private String otp;
}