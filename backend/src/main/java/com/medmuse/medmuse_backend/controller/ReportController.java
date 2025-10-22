package com.medmuse.medmuse_backend.controller;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.itextpdf.text.DocumentException;
import com.medmuse.medmuse_backend.dto.ReportDto;
import com.medmuse.medmuse_backend.dto.UserDto;
import com.medmuse.medmuse_backend.service.interfaces.ReportServiceInterface;
import com.medmuse.medmuse_backend.service.interfaces.UserServiceInterface;
import com.medmuse.medmuse_backend.util.UserContext;

@RestController
@RequestMapping("/reports")
@CrossOrigin(origins = "${medmuse.cors.allowed-origins}")
public class ReportController {

    private final ReportServiceInterface reportService;
    private final UserServiceInterface userService;

    public ReportController(ReportServiceInterface reportService, UserServiceInterface userService) {
        this.reportService = reportService;
        this.userService = userService;
    }
    
    @PostMapping("/generate")
    public ResponseEntity<ReportDto> generateWeeklyReport(
            @AuthenticationPrincipal OidcUser principal) throws DocumentException, IOException {
        
        UserDto user = UserContext.getCurrentUser(principal, userService);
        
        ReportDto report = reportService.generateWeeklyReport(user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(report);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReportDto>> getUserReports(@AuthenticationPrincipal OidcUser principal) {
        UserDto user = UserContext.getCurrentUser(principal, userService);
        List<ReportDto> reports = reportService.getUserReports(user.getId());
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/my/paginated")
    public ResponseEntity<Page<ReportDto>> getUserReportsPaginated(
            @AuthenticationPrincipal OidcUser principal,
            Pageable pageable) {
        UserDto user = UserContext.getCurrentUser(principal, userService);
        Page<ReportDto> reports = reportService.getUserReports(user.getId(), pageable);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<ReportDto> getReport(
            @AuthenticationPrincipal OidcUser principal,
            @PathVariable Long reportId) {
        
        UserDto user = UserContext.getCurrentUser(principal, userService);
        ReportDto report = reportService.getReportById(user.getId(), reportId);
        return ResponseEntity.ok(report);
    }

    @PostMapping("/generate/custom")
    public ResponseEntity<ReportDto> generateCustomReport(
            @AuthenticationPrincipal OidcUser principal,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) throws DocumentException, IOException {

        UserDto user = UserContext.getCurrentUser(principal, userService);
        ReportDto report = reportService.generateReportForPeriod(user.getId(), startDate, endDate);

        return ResponseEntity.status(HttpStatus.CREATED).body(report);
    }
}
