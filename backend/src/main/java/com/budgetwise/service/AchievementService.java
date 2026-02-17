package com.budgetwise.service;

import com.budgetwise.entity.Achievement;
import com.budgetwise.entity.Budget;
import com.budgetwise.entity.Goal;
import com.budgetwise.entity.Transaction;
import com.budgetwise.entity.User;
import com.budgetwise.entity.UserAchievement;
import com.budgetwise.repository.AchievementRepository;
import com.budgetwise.repository.BudgetRepository;
import com.budgetwise.repository.GoalRepository;
import com.budgetwise.repository.TransactionRepository;
import com.budgetwise.repository.UserAchievementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final TransactionRepository transactionRepository;
    private final GoalRepository goalRepository;
    private final BudgetRepository budgetRepository;
    private final NotificationService notificationService;

    @Transactional
    public void checkAndUnlockAchievements(User user) {
        List<Achievement> allAchievements = achievementRepository.findAll();

        for (Achievement achievement : allAchievements) {
            if (userAchievementRepository.existsByUserAndAchievement(user, achievement)) {
                continue; // Already unlocked
            }

            boolean unlocked = false;
            switch (achievement.getType()) {
                case TRANSACTION_COUNT:
                    long count = transactionRepository.countByUser(user);
                    if (count >= achievement.getThreshold()) {
                        unlocked = true;
                    }
                    break;
                case SAVINGS_GOAL_COMPLETED:
                    // Check how many goals the user has completed
                    List<Goal> goals = goalRepository.findByUserOrderByCreatedAtDesc(user);
                    long completedGoals = goals.stream()
                        .filter(goal -> goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >= 0)
                        .count();
                    if (completedGoals >= achievement.getThreshold()) {
                        unlocked = true;
                    }
                    break;
                case BUDGET_ADHERENCE:
                    // Check if user stayed within budget for threshold number of budgets
                    List<Budget> budgets = budgetRepository.findByUser(user);
                    long adherentBudgets = budgets.stream()
                        .filter(budget -> {
                            if (budget.getStartDate() == null || budget.getEndDate() == null) {
                                return false;
                            }
                            // Calculate total spending for this budget period
                            List<Transaction> transactions = transactionRepository.findByUserAndDateRange(
                                user, budget.getStartDate(), budget.getEndDate());
                            BigDecimal totalSpent = transactions.stream()
                                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                                .filter(t -> budget.getCategory() == null || t.getCategory().equals(budget.getCategory()))
                                .map(Transaction::getAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);
                            return totalSpent.compareTo(budget.getAmount()) <= 0;
                        })
                        .count();
                    if (adherentBudgets >= achievement.getThreshold()) {
                        unlocked = true;
                    }
                    break;
                case STREAK:
                    // Check for consecutive days with transactions
                    List<Transaction> transactions = transactionRepository.findByUserOrderByTransactionDateDesc(user);
                    if (!transactions.isEmpty()) {
                        int currentStreak = 0;
                        Set<LocalDate> transactionDates = transactions.stream()
                            .map(t -> t.getTransactionDate().toLocalDate())
                            .collect(Collectors.toSet());
                        
                        LocalDate today = LocalDate.now();
                        LocalDate checkDate = today;
                        
                        // Check for consecutive days going backwards from today
                        while (transactionDates.contains(checkDate)) {
                            currentStreak++;
                            checkDate = checkDate.minusDays(1);
                        }
                        
                        if (currentStreak >= achievement.getThreshold()) {
                            unlocked = true;
                        }
                    }
                    break;
                // Add more cases for other achievement types
            }

            if (unlocked) {
                unlockAchievement(user, achievement);
            }
        }
    }

    private void unlockAchievement(User user, Achievement achievement) {
        UserAchievement userAchievement = UserAchievement.builder()
                .user(user)
                .achievement(achievement)
                .build();
        userAchievementRepository.save(userAchievement);
        
        // Notify user
        notificationService.createNotification(
                user,
                "Achievement Unlocked: " + achievement.getName(),
                achievement.getDescription(),
                "SUCCESS"
        );
        log.info("User {} unlocked achievement {}", user.getEmail(), achievement.getName());
    }

    public List<UserAchievement> getUserAchievements(User user) {
        return userAchievementRepository.findByUser(user);
    }

    public List<Achievement> getAllAchievements() {
        return achievementRepository.findAll();
    }
}
