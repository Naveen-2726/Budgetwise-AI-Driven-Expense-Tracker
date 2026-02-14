package com.budgetwise.controller;

import com.budgetwise.dto.ChangePasswordRequest;
import com.budgetwise.dto.UpdateProfileRequest;
import com.budgetwise.entity.User;
import com.budgetwise.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
        try {
            User user = userService.updateUserProfile(
                    userDetails.getUsername(),
                    request.getFirstName(),
                    request.getLastName()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        try {
            userService.changePassword(
                    userDetails.getUsername(),
                    request.getCurrentPassword(),
                    request.getNewPassword()
            );
            
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
