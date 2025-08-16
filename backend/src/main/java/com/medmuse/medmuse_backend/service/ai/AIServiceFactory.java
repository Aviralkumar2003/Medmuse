package com.medmuse.medmuse_backend.service.ai;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AIServiceFactory {
    
    @Value("${medmuse.ai.provider:mock}")
    private String aiProvider;
    
    private final Map<String, AIService> aiServices;
    
    public AIServiceFactory(List<AIService> aiServiceList) {
        this.aiServices = aiServiceList.stream()
            .collect(Collectors.toMap(AIService::getProviderName, Function.identity()));
    }
    
    public AIService getAIService() {
        AIService service = aiServices.get(aiProvider.toLowerCase());
        if (service == null) {
            // Fallback to mock service
            service = aiServices.get("mock");
        }
        return service;
    }
    
    public AIService getAIServiceWithFallback() {
        AIService primaryService = getAIService();
        if (primaryService.isServiceAvailable()) {
            return primaryService;
        }
        
        // Try to find any available service
        AIService fallbackService = aiServices.values().stream()
            .filter(AIService::isServiceAvailable)
            .findFirst()
            .orElseThrow(() -> new RuntimeException("No AI services are currently available"));
        
        return fallbackService;
    }
    
    public List<String> getAvailableProviders() {
        return aiServices.values().stream()
            .filter(AIService::isServiceAvailable)
            .map(AIService::getProviderName)
            .collect(Collectors.toList());
    }
}
