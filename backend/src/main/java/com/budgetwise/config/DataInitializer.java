package com.budgetwise.config;

import com.budgetwise.entity.Achievement;
import com.budgetwise.repository.AchievementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AchievementRepository achievementRepository;

    @Override
    public void run(String... args) throws Exception {
        if (achievementRepository.count() == 0) {
            createAchievement("First Steps", "Create your first transaction", "Footprints", Achievement.AchievementType.TRANSACTION_COUNT, 1);
            createAchievement("Regular Saver", "Create 10 transactions", "Coins", Achievement.AchievementType.TRANSACTION_COUNT, 10);
            createAchievement("Budget Master", "Create 50 transactions", "Trophy", Achievement.AchievementType.TRANSACTION_COUNT, 50);
            createAchievement("Century Club", "Create 100 transactions", "Crown", Achievement.AchievementType.TRANSACTION_COUNT, 100);
        }
    }

    private void createAchievement(String name, String description, String icon, Achievement.AchievementType type, int threshold) {
        Achievement achievement = Achievement.builder()
                .name(name)
                .description(description)
                .icon(icon)
                .type(type)
                .threshold(threshold)
                .build();
        achievementRepository.save(achievement);
    }
}
