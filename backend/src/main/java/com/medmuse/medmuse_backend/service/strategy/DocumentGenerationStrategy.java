package com.medmuse.medmuse_backend.service.strategy;

import com.medmuse.medmuse_backend.entity.Report;

public interface DocumentGenerationStrategy {
    String generateDocument(Report report);
    byte[] readDocument(String filePath);
    void deleteDocument(String filePath);
    String getDocumentFormat();
    boolean isAvailable();
}
