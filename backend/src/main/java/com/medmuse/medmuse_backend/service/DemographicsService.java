// package com.medmuse.medmuse_backend.service;

// public class DemographicsService {

// }

package com.medmuse.medmuse_backend.service;

import org.springframework.stereotype.Service;

import com.medmuse.medmuse_backend.repository.DemographicsRepository;

@Service
public class DemographicsService {

    private final DemographicsRepository demographicsRepository;

    public DemographicsService(DemographicsRepository demographicsRepository) {
        this.demographicsRepository = demographicsRepository;
    }

    public boolean isDemographicsCompleted(Long userId) {
        return demographicsRepository.existsByUserId(userId);
    }
}
