package com.budgetwise.service;

import com.budgetwise.entity.Goal;
import com.budgetwise.entity.User;
import com.budgetwise.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class GoalService {

    private final GoalRepository goalRepository;

    public Goal createGoal(User user, Goal goal) {
        goal.setUser(user);
        if (goal.getCurrentAmount() == null) {
            goal.setCurrentAmount(BigDecimal.ZERO);
        }
        return goalRepository.save(goal);
    }

    public List<Goal> getUserGoals(User user) {
        return goalRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Goal updateGoal(User user, Long goalId, Goal updatedGoal) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        goal.setName(updatedGoal.getName());
        goal.setTargetAmount(updatedGoal.getTargetAmount());
        goal.setDeadline(updatedGoal.getDeadline());
        goal.setColor(updatedGoal.getColor());
        goal.setIcon(updatedGoal.getIcon());

        return goalRepository.save(goal);
    }

    public void addContribution(User user, Long goalId, BigDecimal amount) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        goal.setCurrentAmount(goal.getCurrentAmount().add(amount));
        goalRepository.save(goal);
    }

    public void deleteGoal(User user, Long goalId) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        goalRepository.delete(goal);
    }
}
