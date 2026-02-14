package com.budgetwise.service;

import com.budgetwise.entity.Transaction;
import com.budgetwise.entity.User;
import com.budgetwise.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIService {

    private final TransactionRepository transactionRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${openrouter.api.key}")
    private String apiKey;

    @Value("${openrouter.api.url}")
    private String apiUrl;

    public String getFinancialInsights(User user) {
        // Fetch recent transactions to give context to AI
        List<Transaction> recentTransactions = transactionRepository.findTop6ByUserOrderByTransactionDateDesc(user);
        
        String transactionSummary = recentTransactions.stream()
                .map(t -> String.format("%s: %s %s on %s", t.getTransactionDate(), t.getType(), t.getAmount(), t.getDescription())) // Assuming Transaction has getDate() or similar
                .collect(Collectors.joining("\n"));
        
        // If getting date is complex, just use toString or similar for basic info
        if (transactionSummary.isEmpty()) {
            transactionSummary = "No recent transactions found.";
        }

        String prompt = "Analyze the following financial transactions and provide a brief, actionable insight (max 2 sentences) for the user to improve their financial health:\n\n" + transactionSummary;

        return callOpenRouter(prompt);
    }

    public String chatWithAI(User user, String userMessage) {
         // Optionally fetch context here too if needed
         return callOpenRouter(userMessage);
    }

    private String callOpenRouter(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);
            // OpenRouter specific headers
            headers.set("HTTP-Referer", "https://budgetwise.app"); 
            headers.set("X-Title", "Budgetwise");

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "openai/gpt-3.5-turbo"); // Or any other cheap/fast model available on OpenRouter
            
            Map<String, String> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);
            
            requestBody.put("messages", new Object[]{message});

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, entity, Map.class);
            
            if (response.getBody() != null && response.getBody().containsKey("choices")) {
                List choices = (List) response.getBody().get("choices");
                if (!choices.isEmpty()) {
                    Map firstChoice = (Map) choices.get(0);
                    Map messageObj = (Map) firstChoice.get("message");
                    return (String) messageObj.get("content");
                }
            }
            return "Unable to generate insights at the moment.";

        } catch (Exception e) {
            log.error("Error calling OpenRouter API", e);
            return "Error generating insights: " + e.getMessage();
        }
    }
}
