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

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@Slf4j
public class GeminiService implements AIServiceInterface {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public GeminiService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    @Override
    public HealthAnalysisResponse analyzeHealthData(HealthAnalysisRequest request) {

        if (request == null || request.getDemographics() == null) {
            throw new RuntimeException("HealthAnalysisRequest or demographics missing");
        }
        System.out.println("Generating prompt.....");
        String prompt = buildPrompt(request);
        System.out.println("Generated prompt.....");

        String aiText = chatClient.prompt(prompt)
                .call()
                .content();   // ✅ This is already the model TEXT output

        System.out.println("Received AI response.....");

        return parseResponse(aiText);
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
            You are a healthcare analytics AI assistant.

            IMPORTANT:
            - Do NOT provide medical diagnosis or treatment advice.
            - Respond ONLY with valid JSON.
            - Do NOT include code fences.
            - Do NOT include explanations.

            Person Data: %s
            Symptom Data: [%s]

            Required JSON format:

            {
              "healthSummary": "...",
              "riskAreas": "...",
              "recommendations": "..."
            }
            """.formatted(demographics, symptoms);
    }

    private HealthAnalysisResponse parseResponse(String aiText) {

        if (aiText == null || aiText.isBlank()) {
            return fallback();
        }

        try {
            // Remove accidental code fences if model ignores instructions
            String cleanJson = aiText
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            JsonNode aiJson = objectMapper.readTree(cleanJson);

            String summary = aiJson.path("healthSummary").asText("No summary available");
            String risks = aiJson.path("riskAreas").asText("No risks detected");
            String recs = aiJson.path("recommendations").asText("No recommendations available");

            return new HealthAnalysisResponse(summary, risks, recs, "Gemini");

        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}", aiText, e);
            return fallback();
        }
    }

    private HealthAnalysisResponse fallback() {
        return new HealthAnalysisResponse(
                "Unable to process AI response.",
                "Parsing error.",
                "Please retry later.",
                "Gemini"
        );
    }
}
