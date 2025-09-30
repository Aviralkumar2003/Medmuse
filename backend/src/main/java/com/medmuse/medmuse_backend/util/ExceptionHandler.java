package com.medmuse.medmuse_backend.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.medmuse.medmuse_backend.exception.FileOperationException;
import com.medmuse.medmuse_backend.exception.ResourceNotFoundException;
import com.medmuse.medmuse_backend.exception.ServiceException;
import com.medmuse.medmuse_backend.exception.UnauthorizedException;
import com.medmuse.medmuse_backend.exception.ValidationException;

public class ExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(ExceptionHandler.class);
    
    public static void handleServiceException(String operation, Exception e) {
        logger.error("Error during {}: {}", operation, e.getMessage(), e);
        throw new ServiceException(operation, e.getMessage(), e);
    }
    
    public static void handleDocumentGenerationException(String documentType, Long reportId, Exception e) {
        logger.error("Document generation failed for {} report {}: {}", documentType, reportId, e.getMessage(), e);
        // Don't throw exception for document generation failures as they're not critical
    }
    
    public static void handleFileOperationException(String operation, String filePath, Exception e) {
        logger.error("File operation failed: {} for file {}: {}", operation, filePath, e.getMessage(), e);
        throw new FileOperationException(operation, filePath, e);
    }
    
    public static void handleUserNotFoundException(String identifier) {
        throw new ResourceNotFoundException("User", "id", identifier);
    }
    
    public static void handleReportNotFoundException(Long reportId) {
        throw new ResourceNotFoundException("Report", "id", reportId);
    }
    
    public static void handleSymptomEntryNotFoundException(Long entryId) {
        throw new ResourceNotFoundException("Symptom Entry", "id", entryId);
    }
    
    public static void handleUnauthorizedAccessException(String resource, Long resourceId) {
        throw new UnauthorizedException("Unauthorized access", resource + ": " + resourceId);
    }
    
    public static void handleInsufficientDataException(String requirement) {
        throw new ValidationException("data", "Insufficient data for operation: " + requirement);
    }
}
