package com.medmuse.medmuse_backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.server.ResponseStatusException;

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

    @GetMapping("/reports/my")
    public ResponseEntity<List<ReportDto>> getMyReports(
            @AuthenticationPrincipal OidcUser principal) {

        UserDto user = UserContext.getCurrentUser(principal, userService);
        List<ReportDto> reports = reportService.getUserReports(user.getId());

        return ResponseEntity.ok(reports);
    }

    @GetMapping("/{reportId}/pdf")
    public ResponseEntity<Resource> downloadReportPdf(
            @AuthenticationPrincipal OidcUser principal,
            @PathVariable Long reportId) {

        UserDto user = UserContext.getCurrentUser(principal, userService);

        // reuse existing service method to ensure authorization & existence
        ReportDto report = reportService.getReportById(user.getId(), reportId);

        // Make sure report has a path to a generated pdf
        String pdfPath = report.getPdfPath();
        if (pdfPath == null || pdfPath.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "PDF not available for this report");
        }

        try {
            Path path = Paths.get(pdfPath);
            if (!Files.exists(path) || !Files.isReadable(path)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "PDF file not found");
            }

            byte[] data = Files.readAllBytes(path);
            ByteArrayResource resource = new ByteArrayResource(data);

            String filename = path.getFileName().toString();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .contentLength(data.length)
                    .body(resource);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to read PDF file", e);
        }
    }
}
