package com.medmuse.medmuse_backend.service.ai;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medmuse.medmuse_backend.dto.HealthAnalysisRequest;
import com.medmuse.medmuse_backend.dto.HealthAnalysisResponse;

@Service
public class OpenAIService implements AIService {
    
    @Value("${medmuse.ai.openai.api-key}")
    private String apiKey;
    
    @Value("${medmuse.ai.openai.model:gpt-4}")
    private String model;
    
    @Value("${medmuse.ai.openai.endpoint}")
    private String endpoint;
    
    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    
    public OpenAIService() {
        this.webClient = WebClient.builder()
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();
        this.objectMapper = new ObjectMapper();
    }
    
    @Override
    public CompletableFuture<HealthAnalysisResponse> analyzeSymptoms(HealthAnalysisRequest request) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String prompt = buildAnalysisPrompt(request);
                String response = callOpenAI(prompt);
                return parseOpenAIResponse(response);
            } catch (Exception e) {
                throw new RuntimeException("OpenAI service failed: " + e.getMessage(), e);
            }
        });
    }
    
    @Override
    public boolean isServiceAvailable() {
        try {
            String testPrompt = "Respond with 'OK' if you're available.";
            String response = callOpenAI(testPrompt);
            return response.contains("OK");
        } catch (Exception e) {
            return false;
        }
    }
    
    @Override
    public String getProviderName() {
        return "openai";
    }
    
    private String buildAnalysisPrompt(HealthAnalysisRequest request) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are a healthcare analytics AI assistant. Analyze the following symptom data and provide insights.\n\n");
        prompt.append("IMPORTANT: Do not provide medical diagnosis or treatment advice. Focus on general health patterns and lifestyle recommendations.\n\n");
        prompt.append("Client Demographics:\n");
        prompt.append(String.format("- Age: %d\n", request.getUserDemographics().getAge()));
        prompt.append(String.format("- Gender: %s\n", request.getUserDemographics().getGender()));
        prompt.append(String.format("- Weight: %.1f kg\n", request.getUserDemographics().getWeight()));
        prompt.append(String.format("- Height: %s\n", request.getUserDemographics().getHeight()));
        prompt.append(String.format("- Nationality: %s\n\n", request.getUserDemographics().getNationality()));

        prompt.append("Symptom Data:\n");
        request.getSymptomEntries().forEach(entry -> {
            prompt.append(String.format("- %s: Severity %d/10 on %s", 
                entry.getSymptomName(), entry.getSeverity(), entry.getEntryDate()));
            if (entry.getNotes() != null && !entry.getNotes().isEmpty()) {
                prompt.append(" (Notes: ").append(entry.getNotes()).append(")");
            }
            prompt.append("\n");
        });
        
        prompt.append("\nPlease provide:\n");
        prompt.append("1. HEALTH_SUMMARY: Overall health trend analysis\n");
        prompt.append("2. RISK_AREAS: Areas that may need attention (non-diagnostic)\n");
        prompt.append("3. RECOMMENDATIONS: Lifestyle and wellness suggestions\n\n");
        prompt.append("Format your response as JSON with keys: healthSummary, riskAreas, recommendations");
        
        return prompt.toString();
    }
    
    private String callOpenAI(String prompt) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", Arrays.asList(
            Map.of("role", "user", "content", prompt)
        ));
        requestBody.put("max_tokens", 1500);
        requestBody.put("temperature", 0.7);
        
        try {
            return webClient.post()
                .uri(endpoint)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        } catch (WebClientResponseException e) {
            throw new RuntimeException("OpenAI API call failed: " + e.getResponseBodyAsString(), e);
        }
    }
    
    private HealthAnalysisResponse parseOpenAIResponse(String response) {
        try {
            JsonNode root = objectMapper.readTree(response);
            String content = root.path("choices").get(0).path("message").path("content").asText();
            
            try {
                JsonNode contentJson = objectMapper.readTree(content);
                return new HealthAnalysisResponse(
                    contentJson.path("healthSummary").asText(),
                    contentJson.path("riskAreas").asText(),
                    contentJson.path("recommendations").asText(),
                    getProviderName()
                );
            } catch (JsonProcessingException e) {
                return parseTextResponse(content);
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse OpenAI response", e);
        }
    }
    
    private HealthAnalysisResponse parseTextResponse(String content) {
        String[] sections = content.split("(?i)(HEALTH_SUMMARY|RISK_AREAS|RECOMMENDATIONS):");
        
        String healthSummary = sections.length > 1 ? sections[1].trim() : "Analysis completed";
        String riskAreas = sections.length > 2 ? sections[1].trim() : "No specific risk areas identified";
        String recommendations = sections.length > 3 ? sections[2].trim() : "Continue monitoring symptoms";
        
        return new HealthAnalysisResponse(healthSummary, riskAreas, recommendations, getProviderName());
    }
}
