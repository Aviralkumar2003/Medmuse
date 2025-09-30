package com.medmuse.medmuse_backend.service.ai;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;
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
public class GeminiService implements AIService {
    
    @Value("${medmuse.ai.gemini.api-key}")
    private String apiKey;
    
    @Value("${medmuse.ai.gemini.model}")
    private String model;
    
    @Value("${medmuse.ai.gemini.endpoint}")
    private String endpoint;
    
    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    
    public GeminiService() {
        this.webClient = WebClient.builder()
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();
        this.objectMapper = new ObjectMapper();
    }
    
    @PostConstruct
    public void init() {
        System.out.println("Initializing GeminiService...");
        if (apiKey == null || apiKey.isEmpty()) {
            System.out.println("Warning: Gemini API key is not set");
        }
        if (model == null || model.isEmpty()) {
            System.out.println("Warning: Gemini model is not set");
        }
        if (endpoint == null || endpoint.isEmpty()) {
            System.out.println("Warning: Gemini endpoint is not set");
        }
        System.out.println("GeminiService initialization complete.");
    }
    
    @Override
    public CompletableFuture<HealthAnalysisResponse> analyzeSymptoms(HealthAnalysisRequest request) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String prompt = buildAnalysisPrompt(request);
                String response = callGemini(prompt);
                return parseGeminiResponse(response);
            } catch (Exception e) {
                throw new RuntimeException("Gemini service failed: " + e.getMessage(), e);
            }
        });
    }
    
    @Override
    public boolean isServiceAvailable() {
        try {
            System.out.println("Checking Gemini service availability...");
            System.out.println("API Key: " + (apiKey != null ? "present" : "null"));
            System.out.println("Model: " + model);
            System.out.println("Endpoint: " + endpoint);
            
            if (apiKey == null || apiKey.isEmpty()) {
                System.out.println("Gemini service unavailable: Missing API key");
                return false;
            }
            
            String testPrompt = "Respond with 'OK' if you're available.";
            String response = callGemini(testPrompt);
            System.out.println("Gemini service test response: " + response);
            return response.contains("OK");
        } catch (Exception e) {
            System.out.println("Gemini service availability check failed: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
    
    @Override
    public String getProviderName() {
        return AIProvider.GEMINI.getProviderName();
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
    
    private String callGemini(String prompt) {
        Map<String, Object> requestBody = new HashMap<>();
        
        // Gemini API request format
        Map<String, Object> contents = new HashMap<>();
        contents.put("role", "user");
        contents.put("parts", new Object[]{
            Map.of("text", prompt)
        });
        
        requestBody.put("contents", new Object[]{contents});
        requestBody.put("generationConfig", Map.of(
            "temperature", 0.7,
            "maxOutputTokens", 1500,
            "model", model
        ));
        
        try {
            String fullEndpoint = endpoint + model + ":generateContent?key=" + apiKey;
            System.out.println("Calling Gemini API at: " + fullEndpoint.replaceAll(apiKey, "API_KEY_HIDDEN"));
            System.out.println("Request body: " + objectMapper.writeValueAsString(requestBody));
            
            String response = webClient.post()
                .uri(fullEndpoint)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
                
            System.out.println("Gemini API response: " + response);
            return response;
        } catch (WebClientResponseException e) {
            System.out.println("Gemini API call failed with status " + e.getStatusCode());
            System.out.println("Response body: " + e.getResponseBodyAsString());
            throw new RuntimeException("Gemini API call failed: " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            System.out.println("Unexpected error calling Gemini API: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Gemini API call failed: " + e.getMessage(), e);
        }
    }
    
    private HealthAnalysisResponse parseGeminiResponse(String response) {
        try {
            JsonNode root = objectMapper.readTree(response);
            String content = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            
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
            throw new RuntimeException("Failed to parse Gemini response", e);
        }
    }
    
    private HealthAnalysisResponse parseTextResponse(String content) {
        String[] sections = content.split("(?i)(HEALTH_SUMMARY|RISK_AREAS|RECOMMENDATIONS):");
        
        String healthSummary = sections.length > 1 ? sections[1].trim() : "Analysis completed";
        String riskAreas = sections.length > 2 ? sections[2].trim() : "No specific risk areas identified";
        String recommendations = sections.length > 3 ? sections[3].trim() : "Continue monitoring symptoms";
        
        return new HealthAnalysisResponse(healthSummary, riskAreas, recommendations, getProviderName());
    }
}