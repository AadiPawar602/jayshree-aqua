package com.jayshreeaqua.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jayshreeaqua.dto.request.LoginRequest;
import com.jayshreeaqua.dto.request.RegisterRequest;
import com.jayshreeaqua.dto.response.ApiResponse;
import com.jayshreeaqua.dto.response.AuthResponse;
import com.jayshreeaqua.service.AuthService;
import com.jayshreeaqua.service.RefreshTokenService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Register and login endpoints")
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Registration successful!"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Login successful"));
    }

    
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Map<String, String>>> refresh(@RequestBody Map<String, String> body) {

        Map<String, String> response = authService.refresh(body.get("refreshToken"));

        return ResponseEntity.ok(ApiResponse.ok(response, "Token refreshed"));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestParam Long userId) {
        refreshTokenService.deleteByUser(userId);
        return ResponseEntity.ok("Logged out successfully");
    }
}