package com.medmuse.medmuse_backend.service.ai;

import com.medmuse.medmuse_backend.dto.HealthAnalysisRequest;
import com.medmuse.medmuse_backend.dto.HealthAnalysisResponse;
import com.medmuse.medmuse_backend.dto.SymptomEntryDto;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class GeminiService implements AIServiceInterface {

    @Value("${medmuse.ai.gemini.api-key}")
    private String apiKey;

    @Value("${medmuse.ai.gemini.endpoint}")
    private String endpoint;

    @Value("${medmuse.ai.gemini.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public HealthAnalysisResponse analyzeHealthData(HealthAnalysisRequest request) {

        if (request == null || request.getUserDemographics() == null) {
            throw new RuntimeException("HealthAnalysisRequest or demographics missing");
        }

        String prompt = buildPrompt(request);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> body = Map.of(
                "model", model,
                "input", List.of(Map.of("text", prompt))
        );

        ResponseEntity<Map> response = restTemplate.postForEntity(endpoint, new HttpEntity<>(body, headers), Map.class);
        String aiText = extractTextFromResponse(response.getBody());

        return new HealthAnalysisResponse(
                extractSection(aiText, "Summary"),
                extractSection(aiText, "Risks"),
                extractSection(aiText, "Recommendations"),
                "Gemini"
        );
    }

    private String buildPrompt(HealthAnalysisRequest request) {
        String symptoms = (request.getSymptomEntries() != null && !request.getSymptomEntries().isEmpty())
                ? request.getSymptomEntries().stream().map(SymptomEntryDto::toString).collect(Collectors.joining(", "))
                : "No symptoms recorded";

        return """
                You are a medical AI assistant.
                User demographics:
                Age: %d, Gender: %s, Weight: %.1fkg, Height: %s, Nationality: %s
                Symptom entries: %s

                Provide:
                1. Summary
                2. Risk areas
                3. Recommendations
                """.formatted(
                request.getUserDemographics().getAge(),
                request.getUserDemographics().getGender(),
                request.getUserDemographics().getWeight(),
                request.getUserDemographics().getHeight(),
                request.getUserDemographics().getNationality(),
                symptoms
        );
    }

    private String extractTextFromResponse(Map<String, Object> body) {
        if (body.containsKey("candidates")) {
            List<?> candidates = (List<?>) body.get("candidates");
            if (!candidates.isEmpty()) {
                Map<?, ?> candidate = (Map<?, ?>) candidates.get(0);
                Map<?, ?> content = (Map<?, ?>) candidate.get("content");
                if (content != null && content.containsKey("text")) {
                    return content.get("text").toString();
                }
            }
        }
        return "";
    }

    private String extractSection(String text, String sectionName) {
        if (text == null || text.isBlank()) {
            return "";
        }
        String[] parts = text.split("(?i)" + sectionName + ":"); // Case-insensitive split
        if (parts.length < 2) {
            return "";
        }
        String section = parts[1].trim();
        int end = section.indexOf("\n\n"); // Stop at next empty line
        return end > 0 ? section.substring(0, end).trim() : section;
    }
}
