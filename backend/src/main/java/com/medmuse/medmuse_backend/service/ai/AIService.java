package com.medmuse.medmuse_backend.service.ai;
import java.util.concurrent.CompletableFuture;

import com.medmuse.medmuse_backend.dto.HealthAnalysisRequest;
import com.medmuse.medmuse_backend.dto.HealthAnalysisResponse;

public interface AIService {
    CompletableFuture<HealthAnalysisResponse> analyzeSymptoms(HealthAnalysisRequest request);
    boolean isServiceAvailable();
    String getProviderName();
}
