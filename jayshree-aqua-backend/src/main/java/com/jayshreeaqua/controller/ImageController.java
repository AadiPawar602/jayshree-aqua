package com.jayshreeaqua.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.jayshreeaqua.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
public class ImageController {

    private final Cloudinary cloudinary;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<String>> uploadImage(
            @RequestParam("file") MultipartFile file
    ) {
        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.emptyMap()
            );

            String imageUrl = uploadResult.get("secure_url").toString();

            return ResponseEntity.ok(
                    ApiResponse.ok(imageUrl, "Image uploaded")
            );

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error("Upload failed: " + e.getMessage())
            );
        }
    }
}