package com.medmuse.medmuse_backend.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medmuse.medmuse_backend.dto.UserDto;
import com.medmuse.medmuse_backend.dto.UserDemographicsDto;
import com.medmuse.medmuse_backend.service.interfaces.UserServiceInterface;
import com.medmuse.medmuse_backend.util.UserContext;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "${medmuse.cors.allowed-origins}")
public class UserController {

    private final UserServiceInterface userService;

    public UserController(UserServiceInterface userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal OidcUser principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            UserDto user = UserContext.getCurrentUser(principal, userService);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateProfile(@AuthenticationPrincipal OidcUser principal,
                                                 @RequestBody Map<String, String> updates) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            UserDto currentUser = UserContext.getCurrentUser(principal, userService);

            String newName = updates.get("name");
            if (newName != null && !newName.trim().isEmpty()) {
                UserDto updatedUser = userService.updateUserProfile(currentUser.getId(), newName.trim());
                return ResponseEntity.ok(updatedUser);
            }
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping("/updateUserDemographics")
    public ResponseEntity<UserDemographicsDto> updateUserDemographics(@AuthenticationPrincipal OidcUser principal,
                                                 @RequestBody Map<String, Object> demographics) {
        System.out.println("Received demographics: " + demographics);
        
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            UserDto currentUser = UserContext.getCurrentUser(principal, userService);
            System.out.println(currentUser);
            System.out.println("----------------------------------------");
            if(!demographics.isEmpty()) {
                System.out.println("In If Block");
                 UserDemographicsDto userDemographics=userService
                                .updateUserDemographics(currentUser.getId(), demographics);
                System.out.println("Updated demographics: " + userDemographics);
                return ResponseEntity.ok(userDemographics);
            }
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    } 

}