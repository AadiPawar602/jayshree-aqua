package com.jayshreeaqua.service;

import com.jayshreeaqua.model.RefreshToken;
import com.jayshreeaqua.model.User;
import com.jayshreeaqua.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository repository;

    @Value("${app.jwt.refresh-expiration-ms}")
    private Long refreshDurationMs;

    public RefreshToken createToken(User user) {

        String token = UUID.randomUUID().toString();

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(token)
                .expiryDate(Instant.now().plusMillis(refreshDurationMs))
                .build();

        return repository.save(refreshToken);
    }

    public RefreshToken verifyToken(String token) {

        RefreshToken refreshToken = repository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            repository.delete(refreshToken);
            throw new RuntimeException("Refresh token expired");
        }

        return refreshToken;
    }

    public void deleteByUser(Long userId) {
        repository.deleteByUser_UserId(userId);
    }
}