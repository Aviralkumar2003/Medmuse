package com.medmuse.medmuse_backend.controller;
import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;
import com.medmuse.medmuse_backend.dto.*;
import com.medmuse.medmuse_backend.service.interfaces.*;
import com.medmuse.medmuse_backend.util.UserContext;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reports")
@CrossOrigin(origins = "${medmuse.cors.allowed-origins}")
public class ReportController {
    
    private final ReportServiceInterface reportService;
    private final UserServiceInterface userService;
    
    @PostMapping("/generate")
    public CompletableFuture<ResponseEntity<ReportDto>> generateWeeklyReport(
            @AuthenticationPrincipal OidcUser principal) {
        
        UserDto user = UserContext.getCurrentUser(principal, userService);
        
        return reportService.generateWeeklyReport(user.getId())
            .thenApply(report -> ResponseEntity.status(HttpStatus.CREATED).body(report))
            .exceptionally(ex -> ResponseEntity.badRequest().build());
    }
    
    @PostMapping("/generate/custom")
    public CompletableFuture<ResponseEntity<ReportDto>> generateCustomReport(
            @AuthenticationPrincipal OidcUser principal,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        
        UserDto user = UserContext.getCurrentUser(principal, userService);
        
        return reportService.generateReportForPeriod(user.getId(), startDate, endDate)
            .thenApply(report -> ResponseEntity.status(HttpStatus.CREATED).body(report))
            .exceptionally(ex -> ResponseEntity.badRequest().build());
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
    
    @GetMapping("/{reportId}/pdf")
    public ResponseEntity<byte[]> getReportPdf(
            @AuthenticationPrincipal OidcUser principal,
            @PathVariable Long reportId) {
        
        UserDto user = UserContext.getCurrentUser(principal, userService);
        byte[] pdfBytes = reportService.getReportPdf(user.getId(), reportId);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "health-report-" + reportId + ".pdf");
        headers.setContentLength(pdfBytes.length);
        
        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
    
    @DeleteMapping("/{reportId}")
    public ResponseEntity<Void> deleteReport(
            @AuthenticationPrincipal OidcUser principal,
            @PathVariable Long reportId) {
        
        UserDto user = UserContext.getCurrentUser(principal, userService);
        reportService.deleteReport(user.getId(), reportId);
        return ResponseEntity.noContent().build();
    }
}
