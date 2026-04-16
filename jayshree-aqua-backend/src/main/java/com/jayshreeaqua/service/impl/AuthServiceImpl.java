package com.jayshreeaqua.service.impl;

import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jayshreeaqua.dto.request.LoginRequest;
import com.jayshreeaqua.dto.request.RegisterRequest;
import com.jayshreeaqua.dto.response.AuthResponse;
import com.jayshreeaqua.exception.BadRequestException;
import com.jayshreeaqua.model.RefreshToken;
import com.jayshreeaqua.model.User;
import com.jayshreeaqua.repository.UserRepository;
import com.jayshreeaqua.security.JwtUtils;
import com.jayshreeaqua.security.UserDetailsImpl;
import com.jayshreeaqua.service.AuthService;
import com.jayshreeaqua.service.RefreshTokenService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final JwtUtils jwtUtils;

    // =========================
    // 🔹 REGISTER
    // =========================
    @Override
    @Transactional
    public AuthResponse register(RegisterRequest req) {

        if (userRepository.existsByEmail(req.getEmail()))
            throw new BadRequestException("Email already registered");

        if (userRepository.existsByPhone(req.getPhone()))
            throw new BadRequestException("Phone already registered");

        User user = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail().toLowerCase())
                .phone(req.getPhone())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .addressLine1(req.getAddressLine1())
                .addressLine2(req.getAddressLine2())
                .city(req.getCity())
                .pincode(req.getPincode())
                .role(User.Role.CUSTOMER)
                .isActive(true)
                .build();

        userRepository.save(user);

        // 🔥 FIX: include ROLE
        String accessToken = jwtUtils.generateAccessToken(
                user.getEmail(),
                user.getRole().name()
        );

        RefreshToken refreshToken = refreshTokenService.createToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .userId(user.getUserId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    // =========================
    // 🔹 LOGIN
    // =========================
    @Override
    public AuthResponse login(LoginRequest req) {

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();

        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔥 FIX: use email + role
        String accessToken = jwtUtils.generateAccessToken(
                user.getEmail(),
                user.getRole().name()
        );

        RefreshToken refreshToken = refreshTokenService.createToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .userId(userDetails.getUserId())
                .email(userDetails.getEmail())
                .fullName(userDetails.getFullName())
                .role(userDetails.getRole())
                .build();
    }

    // =========================
    // 🔹 REFRESH
    // =========================
    @Override
    public Map<String, String> refresh(String token) {

        RefreshToken refreshToken = refreshTokenService.verifyToken(token);

        User user = refreshToken.getUser();

        // 🔥 FIX: include role here also
        String newAccessToken = jwtUtils.generateAccessToken(
                user.getEmail(),
                user.getRole().name()
        );

        return Map.of("accessToken", newAccessToken);
    }
}