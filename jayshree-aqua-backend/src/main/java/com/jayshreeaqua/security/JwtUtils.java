package com.jayshreeaqua.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtils {

    private static final Logger log = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    @Value("${app.jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(
                java.util.Base64.getEncoder().encodeToString(jwtSecret.getBytes())
        ));
    }

    // =========================
    // 🔹 ACCESS TOKEN (AUTH OBJECT)
    // =========================
    public String generateToken(Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();

        return Jwts.builder()
                .subject(userDetails.getUsername()) // email
                .claim("userId", userDetails.getUserId())
                .claim("role", userDetails.getRole()) // 🔥 IMPORTANT
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key())
                .compact();
    }

    // =========================
    // 🔹 ACCESS TOKEN (EMAIL + ROLE) ✅ FIXED
    // =========================
    public String generateAccessToken(String email, String role) {
        return Jwts.builder()
                .subject(email)
                .claim("role", role) // 🔥 FIX (VERY IMPORTANT)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key())
                .compact();
    }

    // =========================
    // 🔍 EXTRACT EMAIL
    // =========================
    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // =========================
    // 🔍 EXTRACT ROLE ✅ NEW
    // =========================
    public String getRoleFromToken(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role", String.class);
    }
    // =========================
    // 🔐 VALIDATE ACCESS TOKEN
    // =========================
    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(key()).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
        }
        return false;
    }

    // =========================
    // 🔥 VALIDATE REFRESH TOKEN
    // =========================
    public boolean validateRefreshToken(String token) {
        try {
            Jwts.parser().verifyWith(key()).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Invalid Refresh Token: {}", e.getMessage());
        }
        return false;
    }
}