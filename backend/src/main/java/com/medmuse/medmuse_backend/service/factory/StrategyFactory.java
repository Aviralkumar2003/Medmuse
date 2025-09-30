package com.medmuse.medmuse_backend.service.factory;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.medmuse.medmuse_backend.service.strategy.DocumentGenerationStrategy;
import com.medmuse.medmuse_backend.service.strategy.ReportGenerationStrategy;

@Component
public class StrategyFactory {
    
    private final Map<String, ReportGenerationStrategy> reportStrategies;
    private final Map<String, DocumentGenerationStrategy> documentStrategies;
    
    public StrategyFactory(List<ReportGenerationStrategy> reportStrategyList,
                          List<DocumentGenerationStrategy> documentStrategyList) {
        System.out.println("StrategyFactory initializing with reportStrategies: " + reportStrategyList);
        System.out.println("StrategyFactory initializing with documentStrategies: " + documentStrategyList);
        
        this.reportStrategies = reportStrategyList.stream()
            .collect(Collectors.toMap(ReportGenerationStrategy::getStrategyName, Function.identity()));
        
        this.documentStrategies = documentStrategyList.stream()
            .collect(Collectors.toMap(DocumentGenerationStrategy::getDocumentFormat, Function.identity()));
    }
    
    public ReportGenerationStrategy getReportGenerationStrategy(String strategyName) {
        System.out.println("Getting report generation strategy for: " + strategyName);
        System.out.println("Available strategies: " + reportStrategies.keySet());
        
        ReportGenerationStrategy strategy = reportStrategies.get(strategyName);
        if (strategy == null || !strategy.isAvailable()) {
            System.out.println("Primary strategy not available, looking for fallback...");
            
            // Fallback to first available strategy
            strategy = reportStrategies.values().stream()
                .filter(s -> {
                    boolean available = s.isAvailable();
                    System.out.println("Strategy " + s.getStrategyName() + " available: " + available);
                    return available;
                })
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No available report generation strategies. " +
                    "Total strategies: " + reportStrategies.size() + 
                    ", Registered strategies: " + reportStrategies.keySet()));
        }
        return strategy;
    }
    
    public DocumentGenerationStrategy getDocumentGenerationStrategy(String format) {
        DocumentGenerationStrategy strategy = documentStrategies.get(format);
        if (strategy == null || !strategy.isAvailable()) {
            // Fallback to first available strategy
            strategy = documentStrategies.values().stream()
                .filter(DocumentGenerationStrategy::isAvailable)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No available document generation strategies"));
        }
        return strategy;
    }
    
    public List<String> getAvailableReportStrategies() {
        return reportStrategies.values().stream()
            .filter(ReportGenerationStrategy::isAvailable)
            .map(ReportGenerationStrategy::getStrategyName)
            .collect(Collectors.toList());
    }
    
    public List<String> getAvailableDocumentFormats() {
        return documentStrategies.values().stream()
            .filter(DocumentGenerationStrategy::isAvailable)
            .map(DocumentGenerationStrategy::getDocumentFormat)
            .collect(Collectors.toList());
    }
}
