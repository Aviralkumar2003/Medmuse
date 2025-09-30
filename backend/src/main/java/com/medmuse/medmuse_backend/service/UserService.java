package com.medmuse.medmuse_backend.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;

import com.medmuse.medmuse_backend.dto.UserDemographicsDto;
import com.medmuse.medmuse_backend.dto.UserDto;
import com.medmuse.medmuse_backend.entity.User;
import com.medmuse.medmuse_backend.entity.UserDemographics;
import com.medmuse.medmuse_backend.repository.UserRepository;
import com.medmuse.medmuse_backend.repository.DemographicsRepository;
import com.medmuse.medmuse_backend.service.interfaces.UserServiceInterface;

@Service
@Transactional
public class UserService implements UserServiceInterface {

    private final UserRepository userRepository;
    private final DemographicsRepository demographicRepository;

    public UserService(UserRepository userRepository, DemographicsRepository demographicRepository) {
        this.userRepository = userRepository;
        this.demographicRepository = demographicRepository;
    }

    @Override
    public UserDto createOrUpdateUser(String googleId, String email, String name, String profilePicture) {
        Optional<User> existingUser = userRepository.findByGoogleId(googleId);
        User user = existingUser.orElseGet(() -> new User(googleId, email, name, profilePicture));

        // keep synced with IdP
        user.setEmail(email);
        user.setName(name);
        user.setProfilePicture(profilePicture);

        user = userRepository.save(user);
        return new UserDto(user);
    }

    @Override
    public Optional<UserDto> findByGoogleId(String googleId) {
        return userRepository.findByGoogleId(googleId).map(UserDto::new);
    }

    @Override
    public Optional<UserDto> findById(Long id) {
        return userRepository.findById(id).map(UserDto::new);
    }

    @Override
    public UserDto updateUserProfile(Long userId, String name) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        user.setName(name);
        user = userRepository.save(user);
        return new UserDto(user);
    }

    @Override
    public UserDemographicsDto updateUserDemographics(Long userId, Map<String, Object> demographics) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        
        UserDemographics userDemographics = user.getDemographics();
        if (userDemographics == null) {
            userDemographics = new UserDemographics();
            userDemographics.setUser(user);
            user.setDemographics(userDemographics);
            userDemographics = demographicRepository.save(userDemographics);
        }

        for (Map.Entry<String, Object> entry : demographics.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            switch (key) {
                case "age" -> userDemographics.setAge(((Number) value).intValue());
                case "gender" -> userDemographics.setGender((String) value);
                case "weight" -> userDemographics.setWeight(((Number) value).doubleValue());
                case "height" -> userDemographics.setHeight((String) value);
                case "nationality" -> userDemographics.setNationality((String) value);
                default -> {
                }
            }
        }

        // Save both user and demographics to ensure the relationship is persisted
        userDemographics = demographicRepository.save(userDemographics);
        userRepository.save(user);
        
        return new UserDemographicsDto(userDemographics);
    }
}