package com.budgetwise.service;

import com.budgetwise.entity.Category;
import com.budgetwise.entity.Transaction;
import com.budgetwise.entity.User;
import com.budgetwise.repository.CategoryRepository;
import com.budgetwise.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExcelService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public byte[] exportTransactionsToExcel(User user) {
        List<Transaction> transactions = transactionRepository.findByUserOrderByTransactionDateDesc(user);

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Transactions");

            // -- Header style --
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 12);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.LIGHT_CORNFLOWER_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderBottom(BorderStyle.THIN);

            // -- Currency style --
            CellStyle currencyStyle = workbook.createCellStyle();
            DataFormat format = workbook.createDataFormat();
            currencyStyle.setDataFormat(format.getFormat("$#,##0.00"));

            // -- Date style --
            CellStyle dateStyle = workbook.createCellStyle();
            dateStyle.setDataFormat(format.getFormat("yyyy-mm-dd"));

            // Header row
            String[] headers = {"Date", "Description", "Amount", "Type", "Category", "Payment Method"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data rows
            int rowNum = 1;
            for (Transaction t : transactions) {
                Row row = sheet.createRow(rowNum++);

                Cell dateCell = row.createCell(0);
                if (t.getTransactionDate() != null) {
                    dateCell.setCellValue(t.getTransactionDate().toLocalDate().format(DATE_FMT));
                }

                row.createCell(1).setCellValue(t.getDescription());

                Cell amountCell = row.createCell(2);
                amountCell.setCellValue(t.getAmount().doubleValue());
                amountCell.setCellStyle(currencyStyle);

                row.createCell(3).setCellValue(t.getType().name());
                row.createCell(4).setCellValue(t.getCategory() != null ? t.getCategory().getName() : "Uncategorized");
                row.createCell(5).setCellValue(t.getPaymentMethod() != null ? t.getPaymentMethod().name() : "");
            }

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();

        } catch (Exception e) {
            log.error("Error exporting transactions to Excel", e);
            throw new RuntimeException("Failed to export transactions to Excel", e);
        }
    }

    public List<Transaction> parseExcelFile(User user, MultipartFile file) {
        List<Transaction> transactions = new ArrayList<>();
        List<Category> userCategories = categoryRepository.findByUserOrIsDefaultTrue(user);

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);

            // Skip header row
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                try {
                    String dateStr = getCellStringValue(row.getCell(0));
                    String description = getCellStringValue(row.getCell(1));
                    String amountStr = getCellStringValue(row.getCell(2));
                    String typeStr = getCellStringValue(row.getCell(3));
                    String categoryName = getCellStringValue(row.getCell(4));
                    String paymentMethodStr = getCellStringValue(row.getCell(5));

                    if (description == null || description.isBlank() || amountStr == null || amountStr.isBlank()) {
                        continue; // Skip empty rows
                    }

                    LocalDateTime transactionDate;
                    try {
                        transactionDate = LocalDate.parse(dateStr.trim(), DATE_FMT).atStartOfDay();
                    } catch (Exception e) {
                        transactionDate = LocalDateTime.now();
                    }

                    BigDecimal amount;
                    try {
                        amount = new BigDecimal(amountStr.replace("$", "").replace(",", "").trim());
                    } catch (NumberFormatException e) {
                        continue; // Skip invalid amounts
                    }

                    Transaction.TransactionType type;
                    try {
                        type = Transaction.TransactionType.valueOf(typeStr.trim().toUpperCase());
                    } catch (Exception e) {
                        type = Transaction.TransactionType.EXPENSE;
                    }

                    Transaction.PaymentMethod paymentMethod = null;
                    if (paymentMethodStr != null && !paymentMethodStr.isBlank()) {
                        try {
                            paymentMethod = Transaction.PaymentMethod.valueOf(paymentMethodStr.trim().toUpperCase().replace(" ", "_"));
                        } catch (Exception e) {
                            paymentMethod = Transaction.PaymentMethod.OTHER;
                        }
                    }

                    // Match category by name
                    Category category = userCategories.stream()
                            .filter(c -> c.getName().equalsIgnoreCase(categoryName != null ? categoryName.trim() : ""))
                            .findFirst()
                            .orElse(null);

                    Transaction transaction = Transaction.builder()
                            .description(description.trim())
                            .amount(amount)
                            .type(type)
                            .paymentMethod(paymentMethod)
                            .transactionDate(transactionDate)
                            .user(user)
                            .category(category)
                            .build();

                    transactions.add(transaction);
                } catch (Exception e) {
                    log.warn("Skipping row {} due to parse error: {}", i, e.getMessage());
                }
            }

            // Save all parsed transactions
            transactionRepository.saveAll(transactions);

        } catch (Exception e) {
            log.error("Error parsing Excel file", e);
            throw new RuntimeException("Failed to parse Excel file: " + e.getMessage(), e);
        }

        return transactions;
    }

    private String getCellStringValue(Cell cell) {
        if (cell == null) return null;
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> {
                if (DateUtil.isCellDateFormatted(cell)) {
                    yield cell.getLocalDateTimeCellValue().toLocalDate().format(DATE_FMT);
                }
                yield String.valueOf(cell.getNumericCellValue());
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> cell.getStringCellValue();
            default -> null;
        };
    }
}
