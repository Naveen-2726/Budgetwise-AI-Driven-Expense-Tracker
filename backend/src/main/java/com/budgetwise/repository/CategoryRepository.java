package com.budgetwise.repository;

import com.budgetwise.entity.Category;
import com.budgetwise.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUserOrIsDefaultTrue(User user);
    List<Category> findByIsDefaultTrue();
}