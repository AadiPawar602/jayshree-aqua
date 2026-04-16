package com.jayshreeaqua.service;

import java.util.Map;

import com.jayshreeaqua.dto.request.LoginRequest;
import com.jayshreeaqua.dto.request.RegisterRequest;
import com.jayshreeaqua.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    Map<String, String> refresh(String refreshToken);
}
