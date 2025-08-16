package com.medmuse.medmuse_backend.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(ExceptionHandler.class);
    
    public static void handleServiceException(String operation, Exception e) {
        logger.error("Error during {}: {}", operation, e.getMessage(), e);
        throw new RuntimeException("Service operation failed: " + operation, e);
    }
    
    public static void handleDocumentGenerationException(String documentType, Long reportId, Exception e) {
        logger.error("Document generation failed for {} report {}: {}", documentType, reportId, e.getMessage(), e);
        // Don't throw exception for document generation failures as they're not critical
    }
    
    public static void handleFileOperationException(String operation, String filePath, Exception e) {
        logger.error("File operation failed: {} for file {}: {}", operation, filePath, e.getMessage(), e);
        throw new RuntimeException("File operation failed: " + operation, e);
    }
    
    public static void handleUserNotFoundException(String identifier) {
        throw new RuntimeException("User not found: " + identifier);
    }
    
    public static void handleReportNotFoundException(Long reportId) {
        throw new RuntimeException("Report not found: " + reportId);
    }
    
    public static void handleSymptomEntryNotFoundException(Long entryId) {
        throw new RuntimeException("Symptom entry not found: " + entryId);
    }
    
    public static void handleUnauthorizedAccessException(String resource, Long resourceId) {
        throw new RuntimeException("Unauthorized access to " + resource + ": " + resourceId);
    }
    
    public static void handleInsufficientDataException(String requirement) {
        throw new RuntimeException("Insufficient data for operation: " + requirement);
    }
}
