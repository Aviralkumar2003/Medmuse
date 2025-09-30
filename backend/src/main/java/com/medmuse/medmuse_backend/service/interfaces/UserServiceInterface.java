package com.medmuse.medmuse_backend.service.interfaces;

import java.util.Optional;
import java.util.Map;

import com.medmuse.medmuse_backend.dto.UserDto;
import com.medmuse.medmuse_backend.dto.UserDemographicsDto;

public interface UserServiceInterface {
    UserDto createOrUpdateUser(String googleId, String email, String name, String profilePicture);
    Optional<UserDto> findByGoogleId(String googleId);
    Optional<UserDto> findById(Long id);
    UserDto updateUserProfile(Long userId, String name);
    UserDemographicsDto updateUserDemographics(Long userId, Map<String, Object> demographics);
}
