package com.medmuse.medmuse_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

import com.medmuse.medmuse_backend.service.ai.AIServiceFactory;
import com.medmuse.medmuse_backend.service.strategy.AIReportGenerationStrategy;
import com.medmuse.medmuse_backend.service.strategy.ReportGenerationStrategy;

@Configuration
@ComponentScan({
    "com.medmuse.medmuse_backend.service.ai",
    "com.medmuse.medmuse_backend.service.strategy",
    "com.medmuse.medmuse_backend.service.factory"
})
public class ServiceConfig {
    
    @Bean
    public ReportGenerationStrategy aiReportGenerationStrategy(AIServiceFactory aiServiceFactory) {
        return new AIReportGenerationStrategy(aiServiceFactory);
    }
}