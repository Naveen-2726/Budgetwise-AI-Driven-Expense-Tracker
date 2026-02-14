package com.budgetwise.controller;

import com.budgetwise.dto.BudgetRequest;
import com.budgetwise.dto.BudgetResponse;
import com.budgetwise.entity.User;
import com.budgetwise.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BudgetController {
    
    private final BudgetService budgetService;
    
    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getAllBudgets(@AuthenticationPrincipal User user) {
        List<BudgetResponse> budgets = budgetService.getUserBudgets(user);
        return ResponseEntity.ok(budgets);
    }
    
    @GetMapping("/paged")
    public ResponseEntity<Page<BudgetResponse>> getBudgetsPaged(@AuthenticationPrincipal User user, Pageable pageable) {
        Page<BudgetResponse> budgets = budgetService.getUserBudgets(user, pageable);
        return ResponseEntity.ok(budgets);
    }
    
    @PostMapping
    public ResponseEntity<BudgetResponse> createBudget(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody BudgetRequest request) {
        BudgetResponse budget = budgetService.createBudget(user, request);
        return ResponseEntity.ok(budget);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<BudgetResponse> updateBudget(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody BudgetRequest request) {
        BudgetResponse budget = budgetService.updateBudget(user, id, request);
        return ResponseEntity.ok(budget);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        budgetService.deleteBudget(user, id);
        return ResponseEntity.ok().build();
    }
}
