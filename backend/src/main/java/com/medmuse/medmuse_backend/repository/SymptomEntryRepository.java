package com.medmuse.medmuse_backend.repository;


import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.medmuse.medmuse_backend.entity.SymptomEntry;

@Repository
public interface SymptomEntryRepository extends JpaRepository<SymptomEntry, Long> {
    
    Page<SymptomEntry> findByUserIdOrderByEntryDateDesc(Long userId, Pageable pageable);
    
    List<SymptomEntry> findByUserIdAndEntryDateBetweenOrderByEntryDateDesc(
        Long userId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT se FROM SymptomEntry se WHERE se.user.id = :userId AND se.entryDate >= :startDate")
    List<SymptomEntry> findRecentEntriesForUser(@Param("userId") Long userId, @Param("startDate") LocalDate startDate);
    
    @Query("SELECT COUNT(se) FROM SymptomEntry se WHERE se.user.id = :userId AND se.entryDate = :date")
    Long countByUserIdAndEntryDate(@Param("userId") Long userId, @Param("date") LocalDate date);
    
    void deleteByUserIdAndId(Long userId, Long entryId);
}
