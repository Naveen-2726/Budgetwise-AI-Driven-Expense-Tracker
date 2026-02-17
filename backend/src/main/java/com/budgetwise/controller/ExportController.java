package com.budgetwise.controller;

import com.budgetwise.entity.Transaction;
import com.budgetwise.entity.User;
import com.budgetwise.service.ExcelService;
import com.budgetwise.service.TransactionService;
import com.budgetwise.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
public class ExportController {

    private final TransactionService transactionService;
    private final ExcelService excelService;
    private final UserService userService;

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/transactions/csv")
    public void exportTransactionsToCSV(HttpServletResponse response) throws IOException {
        User user = getAuthenticatedUser();

        response.setContentType("text/csv");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"transactions.csv\"");

        List<Transaction> transactions = transactionService.getAllTransactionsForUser(user);

        try (PrintWriter writer = response.getWriter()) {
            writer.println("Date,Description,Amount,Type,Category,Payment Method");
            for (Transaction t : transactions) {
                writer.printf("%s,\"%s\",%.2f,%s,%s,%s%n",
                        t.getTransactionDate() != null ? t.getTransactionDate().toLocalDate() : "",
                        t.getDescription().replace("\"", "\"\""),
                        t.getAmount(),
                        t.getType(),
                        t.getCategory() != null ? t.getCategory().getName() : "Uncategorized",
                        t.getPaymentMethod() != null ? t.getPaymentMethod() : ""
                );
            }
        }
    }

    @GetMapping("/transactions/excel")
    public ResponseEntity<byte[]> exportTransactionsToExcel() {
        User user = getAuthenticatedUser();
        byte[] excelBytes = excelService.exportTransactionsToExcel(user);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelBytes);
    }

    @PostMapping("/transactions/import")
    public ResponseEntity<Map<String, Object>> importTransactionsFromExcel(@RequestParam("file") MultipartFile file) {
        User user = getAuthenticatedUser();

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Please upload a file"));
        }

        String filename = file.getOriginalFilename();
        if (filename == null || (!filename.endsWith(".xlsx") && !filename.endsWith(".xls"))) {
            return ResponseEntity.badRequest().body(Map.of("message", "Please upload an Excel file (.xlsx or .xls)"));
        }

        List<Transaction> imported = excelService.parseExcelFile(user, file);

        return ResponseEntity.ok(Map.of(
                "message", "Successfully imported " + imported.size() + " transactions",
                "count", imported.size()
        ));
    }
}
