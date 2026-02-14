package com.budgetwise.controller;

import com.budgetwise.dto.*;
import com.budgetwise.entity.User;
import com.budgetwise.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TransactionController {
    
    private final TransactionService transactionService;
    
    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getAllTransactions(@AuthenticationPrincipal User user) {
        List<TransactionResponse> transactions = transactionService.getUserTransactions(user);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/paged")
    public ResponseEntity<Page<TransactionResponse>> getTransactionsPaged(@AuthenticationPrincipal User user, Pageable pageable) {
        Page<TransactionResponse> transactions = transactionService.getUserTransactions(user, pageable);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<TransactionResponse>> getRecentTransactions(@AuthenticationPrincipal User user) {
        List<TransactionResponse> transactions = transactionService.getRecentTransactions(user);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<TransactionStatsResponse> getTransactionStats(@AuthenticationPrincipal User user) {
        TransactionStatsResponse stats = transactionService.getTransactionStats(user);
        return ResponseEntity.ok(stats);
    }
    
    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody TransactionRequest request) {
        TransactionResponse transaction = transactionService.createTransaction(user, request);
        return ResponseEntity.ok(transaction);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request) {
        try {
            TransactionResponse transaction = transactionService.updateTransaction(user, id, request);
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        try {
            transactionService.deleteTransaction(user, id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}