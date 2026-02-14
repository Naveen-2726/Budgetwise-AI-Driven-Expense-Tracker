package com.budgetwise.service;

import com.budgetwise.entity.Achievement;
import com.budgetwise.entity.User;
import com.budgetwise.entity.UserAchievement;
import com.budgetwise.repository.AchievementRepository;
import com.budgetwise.repository.TransactionRepository;
import com.budgetwise.repository.UserAchievementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final TransactionRepository transactionRepository;
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
