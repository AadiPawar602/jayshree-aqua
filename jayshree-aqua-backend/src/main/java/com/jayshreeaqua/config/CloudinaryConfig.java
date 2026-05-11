package com.jayshreeaqua.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(Map.of(
                "cloud_name", "dl4tacxkz",
                "api_key", "648119335652163",
                "api_secret", "fEuf1KVHC7oD_8M_y5A1O4_s1FI"
        ));
    }
}