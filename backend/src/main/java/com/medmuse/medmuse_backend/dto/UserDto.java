package com.medmuse.medmuse_backend.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String googleId;
    private String email;
    private String name;
    private String profilePicture;
    private LocalDateTime createdAt;

    public UserDto(Long id, String googleId, String email, String name, String profilePicture, LocalDateTime createdAt) {
        this.id = id;
        this.googleId = googleId;
        this.email = email;
        this.name = name;
        this.profilePicture = profilePicture;
        this.createdAt = createdAt;
    }
}
