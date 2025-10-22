package com.medmuse.medmuse_backend.service.ai;

import com.medmuse.medmuse_backend.dto.HealthAnalysisRequest;
import com.medmuse.medmuse_backend.dto.HealthAnalysisResponse;

import java.util.concurrent.CompletableFuture;

public interface AIServiceInterface {
    CompletableFuture<HealthAnalysisResponse> analyzeHealthData(HealthAnalysisRequest request);
}
