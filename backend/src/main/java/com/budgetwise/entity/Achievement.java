package com.budgetwise.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "achievements")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false) // Icon name from Lucide (e.g., "Award", "Zap")
    private String icon;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AchievementType type;

    private int threshold; // e.g., 5 goals, 100 transactions

    public enum AchievementType {
        TRANSACTION_COUNT,
        SAVINGS_GOAL_COMPLETED,
        BUDGET_ADHERENCE,
        STREAK
    }
}
