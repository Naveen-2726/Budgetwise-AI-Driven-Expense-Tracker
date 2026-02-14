package com.budgetwise.controller;

import com.budgetwise.dto.*;
import com.budgetwise.entity.User;
import com.budgetwise.security.JwtUtil;
import com.budgetwise.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final UserService userService;
    private final JwtUtil jwtUtil;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = userService.registerUser(
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                request.getPassword()
            );
            
            AuthResponse response = new AuthResponse();
            response.setMessage("Registration successful. Please check your email for OTP verification.");
            response.setEmail(user.getEmail());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Registration failed", e);
            AuthResponse response = new AuthResponse();
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            User user = (User) userService.loadUserByUsername(request.getEmail());
            userService.sendOtp(user);
            
            AuthResponse response = new AuthResponse();
            response.setMessage("OTP sent to your email. Please verify to complete login.");
            response.setEmail(user.getEmail());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login failed", e);
            AuthResponse response = new AuthResponse();
            response.setMessage("Invalid email or user not found");
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody OtpVerificationRequest request) {
        try {
            boolean isValid = userService.verifyOtp(request.getEmail(), request.getOtp());
            
            if (isValid) {
                User user = (User) userService.loadUserByUsername(request.getEmail());
                String token = jwtUtil.generateToken(user);
                
                AuthResponse response = new AuthResponse();
                response.setToken(token);
                response.setEmail(user.getEmail());
                response.setFirstName(user.getFirstName());
                response.setLastName(user.getLastName());
                response.setMessage("Login successful");
                
                return ResponseEntity.ok(response);
            } else {
                AuthResponse response = new AuthResponse();
                response.setMessage("Invalid or expired OTP");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("OTP verification failed", e);
            AuthResponse response = new AuthResponse();
            response.setMessage("OTP verification failed");
            return ResponseEntity.badRequest().body(response);
        }
    }
}