package com.medmuse.medmuse_backend.service.interfaces;

import com.medmuse.medmuse_backend.entity.Report;

public interface PdfServiceInterface {
    String generateReportPdf(Report report);
    byte[] readPdfFile(String filePath);
    void deletePdfFile(String filePath);
}
