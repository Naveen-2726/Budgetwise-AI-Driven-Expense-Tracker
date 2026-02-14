package com.budgetwise.dto;

import lombok.Data;

@Data
public class CategoryResponse {
    private Long id;
    private String name;
    private String emoji;
    private String color;
}