package com.medmuse.medmuse_backend.service.ai;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.medmuse.medmuse_backend.dto.HealthAnalysisRequest;
import com.medmuse.medmuse_backend.dto.HealthAnalysisResponse;
import com.medmuse.medmuse_backend.dto.SymptomEntryDto;

@Service
public class MockAIService implements AIService {
    
    @Override
    public CompletableFuture<HealthAnalysisResponse> analyzeSymptoms(HealthAnalysisRequest request) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            
            return generateMockAnalysis(request);
        });
    }
    
    @Override
    public boolean isServiceAvailable() {
        return true;
    }
    
    @Override
    public String getProviderName() {
        return "mock";
    }
    
    private HealthAnalysisResponse generateMockAnalysis(HealthAnalysisRequest request) {
        Map<String, Long> symptomFrequency = request.getSymptomEntries().stream()
            .collect(Collectors.groupingBy(SymptomEntryDto::getSymptomName, Collectors.counting()));
        
        double avgSeverity = request.getSymptomEntries().stream()
            .mapToInt(SymptomEntryDto::getSeverity)
            .average()
            .orElse(0.0);
        
        String healthSummary = generateHealthSummary(symptomFrequency, avgSeverity, request.getSymptomEntries().size());
        String riskAreas = generateRiskAreas(symptomFrequency, avgSeverity);
        String recommendations = generateRecommendations(symptomFrequency, avgSeverity);
        
        return new HealthAnalysisResponse(healthSummary, riskAreas, recommendations, getProviderName());
    }
    
    private String generateHealthSummary(Map<String, Long> symptoms, double avgSeverity, int totalEntries) {
        StringBuilder summary = new StringBuilder();
        summary.append("Health Summary for the Week:\n\n");
        summary.append(String.format("Total symptom entries recorded: %d\n", totalEntries));
        summary.append(String.format("Average severity level: %.1f/10\n", avgSeverity));
        summary.append(String.format("Most frequently reported symptoms: %s\n\n", 
            symptoms.entrySet().stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                .limit(3)
                .map(e -> e.getKey() + " (" + e.getValue() + " times)")
                .collect(Collectors.joining(", "))));
        
        if (avgSeverity < 4) {
            summary.append("Overall trend: Mild symptoms with good management.");
        } else if (avgSeverity < 7) {
            summary.append("Overall trend: Moderate symptoms requiring attention.");
        } else {
            summary.append("Overall trend: Concerning symptom levels requiring medical evaluation.");
        }
        
        return summary.toString();
    }
    
    private String generateRiskAreas(Map<String, Long> symptoms, double avgSeverity) {
        StringBuilder riskAreas = new StringBuilder();
        
        if (avgSeverity > 6) {
            riskAreas.append("High severity symptoms consistently reported\n");
        }
        
        if (symptoms.containsKey("Headache") && symptoms.get("Headache") > 3) {
            riskAreas.append("Frequent headaches may indicate stress, dehydration, or other underlying issues\n");
        }
        
        if (symptoms.containsKey("Fatigue") && symptoms.get("Fatigue") > 4) {
            riskAreas.append("Persistent fatigue warrants evaluation of sleep patterns and stress levels\n");
        }
        
        if (riskAreas.length() == 0) {
            riskAreas.append("No significant risk areas identified based on current symptom patterns.");
        }
        
        return riskAreas.toString();
    }
    
    private String generateRecommendations(Map<String, Long> symptoms, double avgSeverity) {
        StringBuilder recommendations = new StringBuilder();
        recommendations.append("Personalized Recommendations:\n\n");
        
        recommendations.append("1. Maintain consistent sleep schedule (7-9 hours nightly)\n");
        recommendations.append("2. Stay hydrated (8-10 glasses of water daily)\n");
        recommendations.append("3. Practice stress management techniques (meditation, deep breathing)\n");
        recommendations.append("4. Maintain regular physical activity as tolerated\n");
        
        if (avgSeverity > 6) {
            recommendations.append("5. Consider scheduling a medical consultation for persistent high-severity symptoms\n");
        }
        
        if (symptoms.containsKey("Headache")) {
            recommendations.append("6. Monitor headache triggers (screen time, lighting, stress, food)\n");
        }
        
        recommendations.append("\nIMPORTANT: This analysis is for informational purposes only and should not replace professional medical advice.");
        
        return recommendations.toString();
    }
}
