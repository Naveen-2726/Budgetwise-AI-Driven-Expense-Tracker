package com.budgetwise;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(excludeName = {"org.springframework.boot.autoconfigure.r2dbc.R2dbcAutoConfiguration"})
@EnableScheduling
public class BudgetWiseApplication {
    public static void main(String[] args) {
        SpringApplication.run(BudgetWiseApplication.class, args);
        System.out.print("Budgetwise application running successfully");
    }
}