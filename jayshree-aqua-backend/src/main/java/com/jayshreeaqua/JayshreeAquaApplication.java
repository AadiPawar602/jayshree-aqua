package com.jayshreeaqua;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

/**
 * ╔══════════════════════════════════════════════════════╗
 * ║         JAYSHREE AQUA - Water Delivery System        ║
 * ║         Spring Boot 3.2 | Java 17 | Oracle DB        ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * Swagger UI  → http://localhost:8080/api/swagger-ui.html
 * API Docs    → http://localhost:8080/api/v3/api-docs
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
@EnableMethodSecurity
public class JayshreeAquaApplication {

    public static void main(String[] args) {
        SpringApplication.run(JayshreeAquaApplication.class, args);
        System.out.println("""
            \n
            ╔══════════════════════════════════════════════════════╗
            ║   💧  JAYSHREE AQUA SERVER STARTED SUCCESSFULLY      ║
            ║   🌐  API Base    : http://localhost:8080/api        ║
            ║   📖  Swagger UI  : http://localhost:8080/api/       ║
            ║                     swagger-ui.html                  ║
            ╚══════════════════════════════════════════════════════╝
            """);
    }
}
