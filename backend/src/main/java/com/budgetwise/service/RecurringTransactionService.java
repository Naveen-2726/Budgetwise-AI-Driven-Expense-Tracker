package com.budgetwise.service;

import com.budgetwise.entity.RecurringTransaction;
import com.budgetwise.entity.Transaction;
import com.budgetwise.repository.RecurringTransactionRepository;
import com.budgetwise.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecurringTransactionService {

    private final RecurringTransactionRepository recurringRepository;
    private final TransactionRepository transactionRepository;

    @Scheduled(cron = "0 0 0 * * *") // Run daily at midnight
    @Transactional
    public void processRecurringTransactions() {
        log.info("Processing recurring transactions...");
        LocalDate today = LocalDate.now();
        List<RecurringTransaction> dueTransactions = recurringRepository.findByActiveTrueAndNextRunDateLessThanEqual(today);

        for (RecurringTransaction rt : dueTransactions) {
            createTransactionFromRecurring(rt);
            updateNextRunDate(rt);
        }
        log.info("Processed {} recurring transactions.", dueTransactions.size());
    }

    private void createTransactionFromRecurring(RecurringTransaction rt) {
        Transaction transaction = Transaction.builder()
                .user(rt.getUser())
                .description(rt.getDescription())
                .amount(rt.getAmount())
                .type(rt.getType())
                .category(rt.getCategory())
                .paymentMethod(rt.getPaymentMethod())
                .transactionDate(LocalDateTime.now())
                .build();
        
        transactionRepository.save(transaction);
        log.info("Generated transaction for recurring rule ID: {}", rt.getId());
    }

    private void updateNextRunDate(RecurringTransaction rt) {
        LocalDate nextDate = rt.getNextRunDate();
        switch (rt.getFrequency()) {
            case DAILY -> nextDate = nextDate.plusDays(1);
            case WEEKLY -> nextDate = nextDate.plusWeeks(1);
            case MONTHLY -> nextDate = nextDate.plusMonths(1);
            case YEARLY -> nextDate = nextDate.plusYears(1);
        }
        rt.setNextRunDate(nextDate);
        recurringRepository.save(rt);
    }
}
