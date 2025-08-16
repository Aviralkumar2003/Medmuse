package com.medmuse.medmuse_backend.service.strategy;

import java.util.concurrent.CompletableFuture;

import com.medmuse.medmuse_backend.dto.HealthAnalysisRequest;
import com.medmuse.medmuse_backend.dto.HealthAnalysisResponse;

public interface ReportGenerationStrategy {
    CompletableFuture<HealthAnalysisResponse> analyzeHealthData(HealthAnalysisRequest request);
    String getStrategyName();
    boolean isAvailable();
}
