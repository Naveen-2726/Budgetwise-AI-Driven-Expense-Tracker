package com.budgetwise.dto;

import com.budgetwise.entity.RecurringTransaction;
import com.budgetwise.entity.Transaction;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransactionRequest {
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;
    
    @NotNull(message = "Transaction type is required")
    private Transaction.TransactionType type;
    
    private Transaction.PaymentMethod paymentMethod;
    
    private Long categoryId;
    
    private LocalDate transactionDate;

    private boolean isRecurring;

    private RecurringTransaction.Frequency recurringFrequency;
}