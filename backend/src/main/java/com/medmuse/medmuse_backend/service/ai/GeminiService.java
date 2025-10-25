package com.medmuse.medmuse_backend.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medmuse.medmuse_backend.dto.HealthAnalysisRequest;
import com.medmuse.medmuse_backend.dto.HealthAnalysisResponse;
import com.medmuse.medmuse_backend.dto.SymptomEntryDto;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class GeminiService implements AIServiceInterface {

    @Value("${medmuse.ai.gemini.api-key}")
    private String apiKey;

    @Value("${medmuse.ai.gemini.endpoint}")
    private String endpoint;

    private final WebClient webClient;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public GeminiService(WebClient.Builder webClient) {
        this.webClient = webClient.build();
    }

    @Override
    public HealthAnalysisResponse analyzeHealthData(HealthAnalysisRequest request) {

        if (request == null || request.getDemographics() == null) {
            throw new RuntimeException("HealthAnalysisRequest or demographics missing");
        }

        String prompt = buildPrompt(request);

        Map<String, Object> body = Map.of(
                "contents", new Object[]{
                    Map.of("parts", new Object[]{
                Map.of("text", prompt)
            })
                }
        );

        String response = webClient.post()
                .uri(endpoint + apiKey)
                .header("Content-Type" + "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        log.info("Raw Gemini Response: {}", response);

        return parseResponse(response);
    }

    private String buildPrompt(HealthAnalysisRequest request) {
        // Prepare symptom string
        String symptoms = (request.getSymptomEntries() != null && !request.getSymptomEntries().isEmpty())
                ? request.getSymptomEntries().stream()
                        .map(SymptomEntryDto::toString)
                        .collect(Collectors.joining(", "))
                : "No symptoms recorded";

        // Prepare user demographics
        String demographics = String.format(
                "Age: %s, Gender: %s, Weight: %s, Height: %s, Nationality: %s",
                request.getDemographics().getGender(),
                request.getDemographics().getAge(),
                request.getDemographics().getWeight(),
                request.getDemographics().getHeight(),
                request.getDemographics().getNationality()
        );

        // Build strict JSON-only prompt
        String prompt = """
            You are a healthcare analytics AI assistant. Analyze the following data.

            IMPORTANT: Do NOT provide medical diagnosis or treatment advice. Focus only on general health trends, risk areas, and lifestyle recommendations.

            Person Data: %s
            Symptom Data: [%s]

            Respond ONLY in JSON format exactly as below (no extra text, no explanations):

            {
              "healthSummary": "...",
              "riskAreas": "...",
              "recommendations": "..."
            }
            """.formatted(demographics, symptoms);

        return prompt;
    }

    private HealthAnalysisResponse parseResponse(String response) {
        if (response == null || response.isBlank()) {
            return new HealthAnalysisResponse(
                    "No data available from AI.",
                    "No risk areas identified.",
                    "No recommendations provided.",
                    "Gemini"
            );
        }

        try {
            // Parse top-level Gemini JSON
            JsonNode root = objectMapper.readTree(response);
            JsonNode candidates = root.path("candidates");
            if (!candidates.isArray() || candidates.isEmpty()) {
                log.warn("Gemini response missing candidates: {}", response);
                return new HealthAnalysisResponse("Invalid AI response format.", "", "", "Gemini");
            }

            // Extract text content
            String textContent = candidates.get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText("");

            if (textContent.isBlank()) {
                log.warn("Gemini response has no text content: {}", response);
                return new HealthAnalysisResponse("No data available from AI.", "", "", "Gemini");
            }

            // ✅ Clean up code fences and escaped characters
            String cleanJson = textContent
                    .replaceAll("(?s)```json", "")
                    .replaceAll("(?s)```", "")
                    .trim();

            // Sometimes Gemini double-escapes quotes → fix that safely
            if (cleanJson.startsWith("\"") && cleanJson.endsWith("\"")) {
                cleanJson = objectMapper.readValue(cleanJson, String.class);
            }

            // ✅ Now parse the inner JSON object
            JsonNode aiJson = objectMapper.readTree(cleanJson);

            String summary = aiJson.path("healthSummary").asText("No summary available");
            String risks = aiJson.path("riskAreas").asText("No risks detected");
            String recs = aiJson.path("recommendations").asText("No recommendations available");

            return new HealthAnalysisResponse(summary, risks, recs, "Gemini");

        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}", e.getMessage());
            return new HealthAnalysisResponse(
                    "Unable to parse AI response.",
                    "Parsing error.",
                    "Please retry later.",
                    "Gemini"
            );
        }
    }

}
