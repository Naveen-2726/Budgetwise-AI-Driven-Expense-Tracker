package com.budgetwise.controller;

import com.budgetwise.entity.Goal;
import com.budgetwise.entity.User;
import com.budgetwise.service.GoalService;
import com.budgetwise.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;
    private final UserService userService;

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public ResponseEntity<Goal> createGoal(@RequestBody Goal goal) {
        return ResponseEntity.ok(goalService.createGoal(getAuthenticatedUser(), goal));
    }

    @GetMapping
    public ResponseEntity<List<Goal>> getUserGoals() {
        return ResponseEntity.ok(goalService.getUserGoals(getAuthenticatedUser()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Goal> updateGoal(@PathVariable Long id, @RequestBody Goal goal) {
        return ResponseEntity.ok(goalService.updateGoal(getAuthenticatedUser(), id, goal));
    }

    @PostMapping("/{id}/contribute")
    public ResponseEntity<?> addContribution(@PathVariable Long id, @RequestBody Map<String, BigDecimal> payload) {
        goalService.addContribution(getAuthenticatedUser(), id, payload.get("amount"));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(getAuthenticatedUser(), id);
        return ResponseEntity.ok().build();
    }
}
