package com.medmuse.medmuse_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medmuse.medmuse_backend.entity.UserDemographics;

public interface DemographicsRepository extends JpaRepository<UserDemographics, Long> {
    
}
