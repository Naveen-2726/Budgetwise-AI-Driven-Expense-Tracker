package com.budgetwise.controller;

import com.budgetwise.entity.User;
import com.budgetwise.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AIController {
    
    private final AIService aiService;
    private final com.budgetwise.service.UserService userService;
    
    private User getAuthenticatedUser() {
        org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    @GetMapping("/insights")
    public ResponseEntity<Map<String, Object>> getInsights() {
        String insight = aiService.getFinancialInsights(getAuthenticatedUser());
        
        return ResponseEntity.ok(Map.of(
            "insight", insight,
            "category", "financial_advice"
        ));
    }
    
    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        String response = aiService.chatWithAI(getAuthenticatedUser(), message);
        
        return ResponseEntity.ok(Map.of("response", response));
    }
}