package com.budgetwise.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransactionStatsResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal balance;
    private Long transactionCount;
}