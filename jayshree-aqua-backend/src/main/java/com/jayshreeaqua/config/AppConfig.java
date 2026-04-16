package com.jayshreeaqua.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        return mapper;
    }

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Jayshree Aqua API")
                .description("REST API for Jayshree Aqua Water Delivery Management System")
                .version("v1.0.0")
                .contact(new Contact()
                    .name("Jayshree Aqua")
                    .email("hello@jayshreeaqua.com")))
            .addSecurityItem(new SecurityRequirement().addList("Bearer Auth"))
            .components(new Components().addSecuritySchemes("Bearer Auth",
                new SecurityScheme()
                    .name("Bearer Auth")
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")));
    }
}
