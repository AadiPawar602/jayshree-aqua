package com.jayshreeaqua.config;

import com.jayshreeaqua.security.JwtAuthFilter;
import com.jayshreeaqua.security.UserDetailsServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Value("${app.cors.allowed-origins:http://localhost:3000,http://localhost:5173,http://localhost:5174,http://10.238.209.132:5173}")
    private String allowedOriginsRaw;

    // ===============================
    // AUTH ENTRY POINT
    // ===============================
    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) ->
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
    }

    // ===============================
    // SECURITY FILTER CHAIN
    // ===============================
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // 🔥 DISABLE CSRF
            .csrf(csrf -> csrf.disable())

            // 🔥 ENABLE CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // 🔥 STATELESS SESSION
            .sessionManagement(sm ->
                sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // 🔥 HANDLE UNAUTHORIZED
            .exceptionHandling(ex ->
                ex.authenticationEntryPoint(authenticationEntryPoint())
            )

            // 🔥 ROUTE AUTHORIZATION
            .authorizeHttpRequests(auth -> auth

                // ✅ AUTH APIs
                .requestMatchers("/auth/**").permitAll()

                // ✅ WEBHOOK
                .requestMatchers("/api/webhook/**").permitAll()

                // ✅ SWAGGER
                .requestMatchers(
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html"
                ).permitAll()

                // ✅ ADMIN
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // ✅ EVERYTHING ELSE REQUIRES AUTH
                .anyRequest().authenticated()
            )

            // 🔥 AUTH PROVIDER
            .authenticationProvider(authenticationProvider())

            // 🔥 JWT FILTER
            .addFilterBefore(
                jwtAuthFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    // ===============================
    // CORS CONFIG
    // ===============================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // ✅ ALLOWED ORIGINS
        List<String> origins = Arrays.asList(
                allowedOriginsRaw.split(",")
        );

        config.setAllowedOrigins(origins);

        // ✅ METHODS
        config.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
        ));

        // ✅ HEADERS
        config.setAllowedHeaders(List.of("*"));

        // ✅ EXPOSE HEADERS
        config.setExposedHeaders(List.of(
                "Authorization"
        ));

        // ✅ ALLOW COOKIES / JWT
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }

    // ===============================
    // AUTH PROVIDER
    // ===============================
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider();

        provider.setUserDetailsService(userDetailsService);

        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

    // ===============================
    // AUTH MANAGER
    // ===============================
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {

        return config.getAuthenticationManager();
    }

    // ===============================
    // PASSWORD ENCODER
    // ===============================
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}