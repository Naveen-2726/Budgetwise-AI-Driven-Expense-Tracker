package com.budgetwise.controller;

import com.budgetwise.dto.*;
import com.budgetwise.entity.User;
import com.budgetwise.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoryController {
    
    private final CategoryService categoryService;
    
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getCategories(@AuthenticationPrincipal User user) {
        List<CategoryResponse> categories = categoryService.getUserCategories(user);
        return ResponseEntity.ok(categories);
    }
    
    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @AuthenticationPrincipal User user,
            @RequestParam String name,
            @RequestParam(required = false) String emoji,
            @RequestParam(required = false) String color) {
        CategoryResponse category = categoryService.createCategory(user, name, emoji, color);
        return ResponseEntity.ok(category);
    }
}