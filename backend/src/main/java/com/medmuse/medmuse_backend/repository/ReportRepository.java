package com.medmuse.medmuse_backend.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.medmuse.medmuse_backend.entity.Report;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByUserIdOrderByGeneratedAtDesc(Long userId);
    Page<Report> findByUserIdOrderByGeneratedAtDesc(Long userId, Pageable pageable);
    Optional<Report> findByIdAndUserId(Long reportId, Long userId);
}
