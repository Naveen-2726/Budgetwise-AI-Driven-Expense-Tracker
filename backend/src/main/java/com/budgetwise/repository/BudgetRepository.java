package com.budgetwise.repository;

import com.budgetwise.entity.Budget;
import com.budgetwise.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUser(User user);

    Page<Budget> findByUser(User user, Pageable pageable);

    Optional<Budget> findByUserAndCategory(User user, com.budgetwise.entity.Category category);
}
