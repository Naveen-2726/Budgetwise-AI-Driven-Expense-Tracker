package com.budgetwise.controller;

import com.budgetwise.entity.Achievement;
import com.budgetwise.entity.User;
import com.budgetwise.entity.UserAchievement;
import com.budgetwise.service.AchievementService;
import com.budgetwise.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/achievements")
@RequiredArgsConstructor
public class AchievementController {

    private final AchievementService achievementService;
    private final UserService userService;

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<List<Achievement>> getAllAchievements() {
        return ResponseEntity.ok(achievementService.getAllAchievements());
    }

    @GetMapping("/my")
    public ResponseEntity<List<UserAchievement>> getMyAchievements() {
        return ResponseEntity.ok(achievementService.getUserAchievements(getAuthenticatedUser()));
    }
    
    @GetMapping("/progress")
    public ResponseEntity<Map<String, Object>> getProgress() {
        User user = getAuthenticatedUser();
        List<UserAchievement> unlocked = achievementService.getUserAchievements(user);
        List<Achievement> all = achievementService.getAllAchievements();
        
        return ResponseEntity.ok(Map.of(
            "unlockedCount", unlocked.size(),
            "totalCount", all.size(),
            "percentage", (int)((double)unlocked.size() / all.size() * 100)
        ));
    }
}
