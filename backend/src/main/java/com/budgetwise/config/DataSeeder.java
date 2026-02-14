package com.budgetwise.config;

import com.budgetwise.entity.Category;
import com.budgetwise.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            List<Category> categories = Arrays.asList(
                Category.builder().name("Housing").emoji("🏠").color("#FF5733").build(),
                Category.builder().name("Transportation").emoji("🚗").color("#33FF57").build(),
                Category.builder().name("Food").emoji("🍔").color("#3357FF").build(),
                Category.builder().name("Utilities").emoji("💡").color("#F3FF33").build(),
                Category.builder().name("Healthcare").emoji("🏥").color("#FF33F3").build(),
                Category.builder().name("Entertainment").emoji("🎬").color("#33FFF3").build(),
                Category.builder().name("Shopping").emoji("🛍️").color("#FF8333").build(),
                Category.builder().name("Personal Care").emoji("💅").color("#8333FF").build(),
                Category.builder().name("Education").emoji("🎓").color("#33FF83").build(),
                Category.builder().name("Savings").emoji("💰").color("#3383FF").build()
            );

            categoryRepository.saveAll(categories);
            System.out.println("Default categories seeded successfully!");
        }
    }
}
