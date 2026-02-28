package com.medmuse.medmuse_backend.service.ai;

import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medmuse.medmuse_backend.dto.HealthAnalysisRequest;
import com.medmuse.medmuse_backend.dto.HealthAnalysisResponse;
import com.medmuse.medmuse_backend.dto.SymptomEntryDto;

import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class GeminiService implements AIServiceInterface {

    private final GoogleAiGeminiChatModel model;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public GeminiService(GoogleAiGeminiChatModel model) {
        this.model = model;
    }

    @Override
    public HealthAnalysisResponse analyzeHealthData(HealthAnalysisRequest request) {

        if (request == null || request.getDemographics() == null) {
            throw new RuntimeException("HealthAnalysisRequest or demographics missing");
        }

        String prompt = buildPrompt(request);

        // 🔥 LangChain4j call (no WebClient, no manual endpoint)
        String responseText = model.generate(prompt);

        log.info("Raw AI Response: {}", responseText);

        return parseResponse(responseText);
    }

    private String buildPrompt(HealthAnalysisRequest request) {

        String symptoms = (request.getSymptomEntries() != null && !request.getSymptomEntries().isEmpty())
                ? request.getSymptomEntries().stream()
                        .map(SymptomEntryDto::toString)
                        .collect(Collectors.joining(", "))
                : "No symptoms recorded";

        String demographics = String.format(
                "Age: %s, Gender: %s, Weight: %s, Height: %s, Nationality: %s",
                request.getDemographics().getAge(),
                request.getDemographics().getGender(),
                request.getDemographics().getWeight(),
                request.getDemographics().getHeight(),
                request.getDemographics().getNationality()
        );

        return """
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
    }

    private HealthAnalysisResponse parseResponse(String textContent) {

        if (textContent == null || textContent.isBlank()) {
            return new HealthAnalysisResponse(
                    "No data available from AI.",
                    "No risk areas identified.",
                    "No recommendations provided.",
                    "Gemini"
            );
        }

        try {
            // Remove markdown fences if model adds them
            String cleanJson = textContent
                    .replaceAll("(?s)```json", "")
                    .replaceAll("(?s)```", "")
                    .trim();

            JsonNode aiJson = objectMapper.readTree(cleanJson);

            String summary = aiJson.path("healthSummary").asText("No summary available");
            String risks = aiJson.path("riskAreas").asText("No risks detected");
            String recs = aiJson.path("recommendations").asText("No recommendations available");

            return new HealthAnalysisResponse(summary, risks, recs, "Gemini");

        } catch (Exception e) {
            log.error("Failed to parse AI response: {}", e.getMessage());

            return new HealthAnalysisResponse(
                    "Unable to parse AI response.",
                    "Parsing error.",
                    "Please retry later.",
                    "Gemini"
            );
        }
    }
}
