package com.budgetwise.service;

import com.budgetwise.dto.*;
import com.budgetwise.entity.Category;
import com.budgetwise.entity.User;
import com.budgetwise.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService implements CommandLineRunner {
    
    private final CategoryRepository categoryRepository;
    
    public List<CategoryResponse> getUserCategories(User user) {
        return categoryRepository.findByUserOrIsDefaultTrue(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public CategoryResponse createCategory(User user, String name, String emoji, String color) {
        Category category = Category.builder()
                .name(name)
                .emoji(emoji)
                .color(color)
                .isDefault(false)
                .user(user)
                .build();
        
        Category saved = categoryRepository.save(category);
        return mapToResponse(saved);
    }
    
    private CategoryResponse mapToResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setEmoji(category.getEmoji());
        response.setColor(category.getColor());
        return response;
    }
    
    @Override
    public void run(String... args) {
        if (categoryRepository.findByIsDefaultTrue().isEmpty()) {
            initializeDefaultCategories();
        }
    }
    
    private void initializeDefaultCategories() {
        List<Category> defaultCategories = Arrays.asList(
            Category.builder().name("Food & Dining").emoji("🍽️").color("#FF6B6B").isDefault(true).build(),
            Category.builder().name("Transportation").emoji("🚗").color("#4ECDC4").isDefault(true).build(),
            Category.builder().name("Shopping").emoji("🛍️").color("#45B7D1").isDefault(true).build(),
            Category.builder().name("Entertainment").emoji("🎬").color("#96CEB4").isDefault(true).build(),
            Category.builder().name("Bills & Utilities").emoji("💡").color("#FFEAA7").isDefault(true).build(),
            Category.builder().name("Healthcare").emoji("🏥").color("#DDA0DD").isDefault(true).build(),
            Category.builder().name("Education").emoji("📚").color("#98D8C8").isDefault(true).build(),
            Category.builder().name("Travel").emoji("✈️").color("#F7DC6F").isDefault(true).build(),
            Category.builder().name("Salary").emoji("💰").color("#52C41A").isDefault(true).build(),
            Category.builder().name("Investment").emoji("📈").color("#1890FF").isDefault(true).build(),
            Category.builder().name("Gift").emoji("🎁").color("#EB2F96").isDefault(true).build(),
            Category.builder().name("Other").emoji("📝").color("#8C8C8C").isDefault(true).build()
        );
        
        categoryRepository.saveAll(defaultCategories);
    }
}