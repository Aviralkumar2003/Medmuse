package com.medmuse.medmuse_backend.dto;
import java.time.LocalDateTime;

import com.medmuse.medmuse_backend.entity.User;

import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String googleId;
    private String email;
    private String name;
    private String profilePicture;
    private LocalDateTime createdAt;

    
    public UserDto(User user) {
        this.id = user.getId();
        this.googleId = user.getGoogleId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.profilePicture = user.getProfilePicture();
        this.createdAt = user.getCreatedAt();
    }
}
