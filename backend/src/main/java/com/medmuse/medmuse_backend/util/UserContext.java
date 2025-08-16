package com.medmuse.medmuse_backend.util;

import org.springframework.security.oauth2.core.oidc.user.OidcUser;

import com.medmuse.medmuse_backend.dto.UserDto;
import com.medmuse.medmuse_backend.service.interfaces.UserServiceInterface;

public class UserContext {
    
    public static UserDto getCurrentUser(OidcUser principal, UserServiceInterface userService) {
        String googleId = principal.getName();
        return userService.findByGoogleId(googleId)
            .orElseThrow(() -> new RuntimeException("User not found: " + googleId));
    }
    
    public static void validateUserAccess(Long userId, Long resourceUserId) {
        if (!userId.equals(resourceUserId)) {
            throw new RuntimeException("Unauthorized access to user resource: " + resourceUserId);
        }
    }
}
