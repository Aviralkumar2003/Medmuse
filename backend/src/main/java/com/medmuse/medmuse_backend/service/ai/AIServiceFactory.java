package com.medmuse.medmuse_backend.service.ai;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AIServiceFactory {
    
    @Value("${medmuse.ai.provider:openai}")
    private String aiProvider;
    
    private final Map<String, AIService> aiServices;
    
    public AIServiceFactory(List<AIService> aiServiceList) {
        this.aiServices = aiServiceList.stream()
            .collect(Collectors.toMap(AIService::getProviderName, Function.identity()));
        System.out.println("Registered AI services: " + aiServices.keySet());
    }
    
    public AIService getAIService() {
        System.out.println("Getting AI service for provider: " + aiProvider);
        System.out.println("Available services: " + aiServices.keySet());
        
        AIService service = aiServices.get(aiProvider.toLowerCase());
        if (service == null) {
            System.out.println("Primary service not found, falling back to OpenAI");
            service = aiServices.get("openai");
        }
        return service;
    }
    
    public AIService getAIServiceWithFallback() {
        System.out.println("Getting AI service with fallback");
        AIService primaryService = getAIService();
        System.out.println("Primary service: " + primaryService.getProviderName());
        
        if (primaryService.isServiceAvailable()) {
            System.out.println("Primary service is available");
            return primaryService;
        }
        
        System.out.println("Primary service not available, looking for fallback");
        // Try to find any available service
        AIService fallbackService = aiServices.values().stream()
            .peek(service -> System.out.println("Checking availability of service: " + service.getProviderName()))
            .filter(service -> {
                boolean available = service.isServiceAvailable();
                System.out.println("Service " + service.getProviderName() + " available: " + available);
                return available;
            })
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
