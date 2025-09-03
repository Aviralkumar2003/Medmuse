package com.medmuse.medmuse_backend.controller;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;
import com.medmuse.medmuse_backend.dto.UserDto;
import com.medmuse.medmuse_backend.service.interfaces.UserServiceInterface;
import com.medmuse.medmuse_backend.util.UserContext;
import lombok.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "${medmuse.cors.allowed-origins}")
public class AuthController {

    private final UserServiceInterface userService;


    @GetMapping("/status")
    public ResponseEntity<?> getAuthStatus(@AuthenticationPrincipal OidcUser principal) {
        if (principal == null) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }
        
        try {
            UserDto user = UserContext.getCurrentUser(principal, userService);
            return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "user", user
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }
    }

    @GetMapping("/user")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal OidcUser principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        
        try {
            UserDto user = UserContext.getCurrentUser(principal, userService);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/login")
    public ResponseEntity<Map<String, String>> getLoginUrl() {
        return ResponseEntity.ok(Map.of(
            "loginUrl", "/oauth2/authorization/google"
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of(
            "message", "Logout initiated",
            "logoutUrl", "/logout"
        ));
    }
}
