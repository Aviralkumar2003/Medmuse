package com.medmuse.medmuse_backend.service.strategy;

import java.util.concurrent.CompletableFuture;

import org.springframework.stereotype.Component;

import com.medmuse.medmuse_backend.dto.HealthAnalysisRequest;
import com.medmuse.medmuse_backend.dto.HealthAnalysisResponse;
import com.medmuse.medmuse_backend.service.ai.AIServiceFactory;

@Component
public class AIReportGenerationStrategy implements ReportGenerationStrategy {
    
    private final AIServiceFactory aiServiceFactory;
    
    public AIReportGenerationStrategy(AIServiceFactory aiServiceFactory) {
        this.aiServiceFactory = aiServiceFactory;
    }
    
    @Override
    public CompletableFuture<HealthAnalysisResponse> analyzeHealthData(HealthAnalysisRequest request) {
        return aiServiceFactory.getAIServiceWithFallback().analyzeSymptoms(request);
    }
    
    @Override
    public String getStrategyName() {
        return "AI_ANALYSIS";
    }
    
    @Override
    public boolean isAvailable() {
        try {
            return aiServiceFactory.getAIServiceWithFallback().isServiceAvailable();
        } catch (Exception e) {
            return false;
        }
    }
}
