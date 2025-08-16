package com.medmuse.medmuse_backend.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medmuse.medmuse_backend.dto.UserDto;
import com.medmuse.medmuse_backend.entity.User;
import com.medmuse.medmuse_backend.repository.UserRepository;
import com.medmuse.medmuse_backend.service.interfaces.UserServiceInterface;

@Service
@Transactional
public class UserService implements UserServiceInterface {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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
}