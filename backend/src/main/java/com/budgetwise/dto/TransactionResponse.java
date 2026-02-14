package com.budgetwise.dto;

import com.budgetwise.entity.Transaction;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionResponse {
    private Long id;
    private String description;
    private BigDecimal amount;
    private Transaction.TransactionType type;
    private Transaction.PaymentMethod paymentMethod;
    private LocalDateTime transactionDate;
    private LocalDateTime createdAt;
    private CategoryResponse category;
}