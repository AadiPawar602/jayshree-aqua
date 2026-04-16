package com.jayshreeaqua.dto.response;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuthResponse {
   
    private String accessToken;
    private String refreshToken; 
    private Long userId;
    private String email;
    private String fullName;
    private String role;
}
