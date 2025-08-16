package com.medmuse.medmuse_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.medmuse.medmuse_backend.entity.Symptom;

@Repository
public interface SymptomRepository extends JpaRepository<Symptom, Long> {
    List<Symptom> findByIsActiveTrue();
    List<Symptom> findByCategoryAndIsActiveTrue(String category);
    List<Symptom> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);
}
