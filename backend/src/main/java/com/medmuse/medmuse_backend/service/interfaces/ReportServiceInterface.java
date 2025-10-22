package com.medmuse.medmuse_backend.service.interfaces;

import com.itextpdf.text.DocumentException;
import com.medmuse.medmuse_backend.dto.ReportDto;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReportServiceInterface {
    ReportDto generateReportForPeriod(Long userId, LocalDate startDate, LocalDate endDate) throws DocumentException, IOException;   
    // List<ReportDto> getUserReports(Long userId);
    // Page<ReportDto> getUserReports(Long userId, Pageable pageable);
    // ReportDto getReportById(Long userId, Long reportId);

    ReportDto generateWeeklyReport(Long id) throws DocumentException, IOException;
    List<ReportDto> getUserReports(Long id);

    Page<ReportDto> getUserReports(Long id, Pageable pageable);

    ReportDto getReportById(Long id, Long reportId);
}
