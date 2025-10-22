package com.medmuse.medmuse_backend.service.ai;

import com.medmuse.medmuse_backend.dto.HealthAnalysisRequest;
import com.medmuse.medmuse_backend.dto.HealthAnalysisResponse;


public interface AIServiceInterface {
    HealthAnalysisResponse analyzeHealthData(HealthAnalysisRequest request);
}
