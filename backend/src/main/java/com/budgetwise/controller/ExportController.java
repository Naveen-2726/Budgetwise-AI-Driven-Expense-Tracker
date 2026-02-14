package com.budgetwise.controller;

import com.budgetwise.entity.Transaction;
import com.budgetwise.entity.User;
import com.budgetwise.service.TransactionService;
import com.budgetwise.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class ExportController {

    private final TransactionService transactionService;
    private final UserService userService;

    @GetMapping("/export")
    public void exportTransactionsToCSV(HttpServletResponse response) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        response.setContentType("text/csv");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"transactions.csv\"");

        List<Transaction> transactions = transactionService.getAllTransactionsForUser(user);

        try (PrintWriter writer = response.getWriter()) {
            // Header
            writer.println("ID,Date,Description,Amount,Type,Category,Payment Method");

            // Data
            for (Transaction t : transactions) {
                writer.printf("%d,%s,\"%s\",%.2f,%s,%s,%s%n",
                        t.getId(),
                        t.getTransactionDate(),
                        t.getDescription().replace("\"", "\"\""), // Escape quotes
                        t.getAmount(),
                        t.getType(),
                        t.getCategory() != null ? t.getCategory().getName() : "Uncategorized",
                        t.getPaymentMethod()
                );
            }
        }
    }
}
