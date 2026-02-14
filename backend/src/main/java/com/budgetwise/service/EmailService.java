package com.budgetwise.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    public void sendOtp(String email, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("BudgetWise - Your Login OTP");
            message.setText(buildOtpMessage(otp));
            
            mailSender.send(message);
            log.info("OTP email sent successfully to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send OTP email to: {}", email, e);
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }
    
    private String buildOtpMessage(String otp) {
        return String.format("""
            Welcome to BudgetWise!
            
            Your One-Time Password (OTP) is: %s
            
            This OTP is valid for 10 minutes. Please do not share this code with anyone.
            
            If you didn't request this OTP, please ignore this email.
            
            Best regards,
            BudgetWise Team
            """, otp);
    }
}