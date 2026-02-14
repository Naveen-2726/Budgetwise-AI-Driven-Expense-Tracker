package com.budgetwise.controller;

import com.budgetwise.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfileController {
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "email", user.getEmail(),
            "firstName", user.getFirstName(),
            "lastName", user.getLastName(),
            "isVerified", user.getIsVerified(),
            "createdAt", user.getCreatedAt()
        ));
    }
}