package com.medmuse.medmuse_backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String googleId;
    private String email;
    private String name;
    private String profilePicture;
    private LocalDateTime createdAt;

}
