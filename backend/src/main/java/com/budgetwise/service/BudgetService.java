package com.budgetwise.service;

import com.budgetwise.dto.BudgetRequest;
import com.budgetwise.dto.BudgetResponse;
import com.budgetwise.dto.CategoryResponse;
import com.budgetwise.entity.Budget;
import com.budgetwise.entity.Category;
import com.budgetwise.entity.User;
import com.budgetwise.repository.BudgetRepository;
import com.budgetwise.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BudgetService {
    
    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    
    public BudgetResponse createBudget(User user, BudgetRequest request) {
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            
            // Check if budget already exists for this category
            if (budgetRepository.findByUserAndCategory(user, category).isPresent()) {
                throw new RuntimeException("Budget already exists for this category");
            }
        }
        
        Budget budget = Budget.builder()
                .amount(request.getAmount())
                .startDate(request.getStartDate() != null ? request.getStartDate() : LocalDateTime.now().withDayOfMonth(1))
                .endDate(request.getEndDate() != null ? request.getEndDate() : LocalDateTime.now().withDayOfMonth(1).plusMonths(1).minusDays(1))
                .user(user)
                .category(category)
                .build();
        
        Budget saved = budgetRepository.save(budget);
        return mapToResponse(saved);
    }
    
    public List<BudgetResponse> getUserBudgets(User user) {
        return budgetRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public Page<BudgetResponse> getUserBudgets(User user, Pageable pageable) {
        return budgetRepository.findByUser(user, pageable)
                .map(this::mapToResponse);
    }
    
    public BudgetResponse updateBudget(User user, Long budgetId, BudgetRequest request) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        
        if (!budget.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to budget");
        }
        
        budget.setAmount(request.getAmount());
        if (request.getStartDate() != null) budget.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) budget.setEndDate(request.getEndDate());
        
        Budget updated = budgetRepository.save(budget);
        return mapToResponse(updated);
    }
    
    public void deleteBudget(User user, Long budgetId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        
        if (!budget.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to budget");
        }
        
        budgetRepository.delete(budget);
    }
    
    private BudgetResponse mapToResponse(Budget budget) {
        BudgetResponse response = new BudgetResponse();
        response.setId(budget.getId());
        response.setAmount(budget.getAmount());
        response.setStartDate(budget.getStartDate());
        response.setEndDate(budget.getEndDate());
        response.setCreatedAt(budget.getCreatedAt());
        
        if (budget.getCategory() != null) {
            CategoryResponse categoryResponse = new CategoryResponse();
            categoryResponse.setId(budget.getCategory().getId());
            categoryResponse.setName(budget.getCategory().getName());
            categoryResponse.setEmoji(budget.getCategory().getEmoji());
            categoryResponse.setColor(budget.getCategory().getColor());
            response.setCategory(categoryResponse);
        }
        
        return response;
    }
}
