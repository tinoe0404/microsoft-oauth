package com.demo.oauth.controller;

import com.demo.oauth.dto.UserDTO;
import com.demo.oauth.service.GraphService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api")
public class MeController {

    private final GraphService graphService;

    public MeController(GraphService graphService) {
        this.graphService = graphService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getMe(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            log.warn("Unauthenticated access attempt to /api/me");
            return ResponseEntity.status(401).build();
        }

        UserDTO userProfile = graphService.getUserProfile();
        
        if (userProfile != null && userProfile.getEmail() == null) {
            String fallbackEmail = principal.getAttribute("email");
            if (fallbackEmail == null) {
                fallbackEmail = principal.getAttribute("preferred_username");
            }
            userProfile.setEmail(fallbackEmail);
        }

        return ResponseEntity.ok(userProfile);
    }
}
