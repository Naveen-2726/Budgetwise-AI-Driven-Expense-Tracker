package com.budgetwise.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetRequest {
    
    private BigDecimal amount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Long categoryId;
}
