package com.budgetwise.service;

import com.budgetwise.dto.*;
import com.budgetwise.entity.Category;
import com.budgetwise.entity.RecurringTransaction;
import com.budgetwise.entity.Transaction;
import com.budgetwise.entity.User;
import com.budgetwise.repository.CategoryRepository;
import com.budgetwise.repository.TransactionRepository;
import com.budgetwise.repository.RecurringTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
@Transactional
public class TransactionService {
    
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final RecurringTransactionRepository recurringTransactionRepository;
    private final AchievementService achievementService;
    
    public TransactionResponse createTransaction(User user, TransactionRequest request) {
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }
        
        Transaction transaction = Transaction.builder()
                .description(request.getDescription())
                .amount(request.getAmount())
                .type(request.getType())
                .paymentMethod(request.getPaymentMethod())
                .transactionDate(request.getTransactionDate() != null ? request.getTransactionDate().atStartOfDay() : LocalDateTime.now())
                .user(user)
                .category(category)
                .build();
        
        Transaction saved = transactionRepository.save(transaction);

        if (request.isRecurring() && request.getRecurringFrequency() != null) {
            LocalDate nextRunDate = request.getTransactionDate() != null ? request.getTransactionDate() : LocalDate.now();
            switch (request.getRecurringFrequency()) {
                case DAILY -> nextRunDate = nextRunDate.plusDays(1);
                case WEEKLY -> nextRunDate = nextRunDate.plusWeeks(1);
                case MONTHLY -> nextRunDate = nextRunDate.plusMonths(1);
                case YEARLY -> nextRunDate = nextRunDate.plusYears(1);
            }

            RecurringTransaction recurring = RecurringTransaction.builder()
                    .description(request.getDescription())
                    .amount(request.getAmount())
                    .type(request.getType())
                    .frequency(request.getRecurringFrequency())
                    .paymentMethod(request.getPaymentMethod())
                    .nextRunDate(nextRunDate)
                    .user(user)
                    .category(category)
                    .active(true)
                    .build();
            recurringTransactionRepository.save(recurring);
        }

        // Check for achievements
        achievementService.checkAndUnlockAchievements(user);

        return mapToResponse(saved);
    }
    
    public List<Transaction> getAllTransactionsForUser(User user) {
        return transactionRepository.findByUserOrderByTransactionDateDesc(user);
    }

    public List<TransactionResponse> getUserTransactions(User user) {
        return transactionRepository.findByUserOrderByTransactionDateDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public Page<TransactionResponse> getUserTransactions(User user, Pageable pageable) {
        return transactionRepository.findByUserOrderByTransactionDateDesc(user, pageable)
                .map(this::mapToResponse);
    }
    
    public List<TransactionResponse> getRecentTransactions(User user) {
        return transactionRepository.findTop6ByUserOrderByTransactionDateDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public TransactionStatsResponse getTransactionStats(User user) {
        BigDecimal totalIncome = transactionRepository.sumAmountByUserAndType(user, Transaction.TransactionType.INCOME);
        BigDecimal totalExpenses = transactionRepository.sumAmountByUserAndType(user, Transaction.TransactionType.EXPENSE);
        Long transactionCount = transactionRepository.countByUser(user);
        
        if (totalIncome == null) totalIncome = BigDecimal.ZERO;
        if (totalExpenses == null) totalExpenses = BigDecimal.ZERO;
        
        TransactionStatsResponse stats = new TransactionStatsResponse();
        stats.setTotalIncome(totalIncome);
        stats.setTotalExpenses(totalExpenses);
        stats.setBalance(totalIncome.subtract(totalExpenses));
        stats.setTransactionCount(transactionCount);
        
        return stats;
    }
    
    public TransactionResponse updateTransaction(User user, Long transactionId, TransactionRequest request) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to transaction");
        }
        
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }
        
        transaction.setDescription(request.getDescription());
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setPaymentMethod(request.getPaymentMethod());
        transaction.setCategory(category);
        
        if (request.getTransactionDate() != null) {
            transaction.setTransactionDate(request.getTransactionDate().atStartOfDay());
        }
        
        Transaction updated = transactionRepository.save(transaction);
        return mapToResponse(updated);
    }
    
    public void deleteTransaction(User user, Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to transaction");
        }
        
        transactionRepository.delete(transaction);
    }
    
    private TransactionResponse mapToResponse(Transaction transaction) {
        TransactionResponse response = new TransactionResponse();
        response.setId(transaction.getId());
        response.setDescription(transaction.getDescription());
        response.setAmount(transaction.getAmount());
        response.setType(transaction.getType());
        response.setPaymentMethod(transaction.getPaymentMethod());
        response.setTransactionDate(transaction.getTransactionDate());
        response.setCreatedAt(transaction.getCreatedAt());
        
        if (transaction.getCategory() != null) {
            CategoryResponse categoryResponse = new CategoryResponse();
            categoryResponse.setId(transaction.getCategory().getId());
            categoryResponse.setName(transaction.getCategory().getName());
            categoryResponse.setEmoji(transaction.getCategory().getEmoji());
            categoryResponse.setColor(transaction.getCategory().getColor());
            response.setCategory(categoryResponse);
        }
        
        return response;
    }
}