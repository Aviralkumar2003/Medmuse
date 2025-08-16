package com.medmuse.medmuse_backend.service.interfaces;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.medmuse.medmuse_backend.dto.ReportDto;

public interface ReportServiceInterface {
    CompletableFuture<ReportDto> generateWeeklyReport(Long userId);
    CompletableFuture<ReportDto> generateReportForPeriod(Long userId, LocalDate startDate, LocalDate endDate);
    List<ReportDto> getUserReports(Long userId);
    Page<ReportDto> getUserReports(Long userId, Pageable pageable);
    ReportDto getReportById(Long userId, Long reportId);
    void deleteReport(Long userId, Long reportId);
    byte[] getReportPdf(Long userId, Long reportId);
}
