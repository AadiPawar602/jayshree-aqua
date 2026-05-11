package com.jayshreeaqua.controller;

import com.jayshreeaqua.dto.request.ProductRequest;
import com.jayshreeaqua.dto.response.ApiResponse;
import com.jayshreeaqua.dto.response.ProductResponse;
import com.jayshreeaqua.model.Product;
import com.jayshreeaqua.service.ProductService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Water bottle catalog")
public class ProductController {

    private final ProductService productService;

    // ✅ PUBLIC
    @GetMapping
    @Operation(summary = "Get all available products")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAll() {
        return ResponseEntity.ok(
                ApiResponse.ok(productService.getAllAvailable(), "Products fetched")
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<ApiResponse<ProductResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.ok(productService.getById(id), "Product found")
        );
    }

    @GetMapping("/type/{waterType}")
    @Operation(summary = "Get products by water type")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getByType(
            @PathVariable Product.WaterType waterType) {

        return ResponseEntity.ok(
                ApiResponse.ok(productService.getByWaterType(waterType), "Products fetched")
        );
    }

    // ✅ ADMIN CREATE
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Auth")
    @Operation(summary = "Add new product [ADMIN]")
    public ResponseEntity<ApiResponse<ProductResponse>> create(
            @Valid @RequestBody ProductRequest request   // 🔥 FIX
    ) {

        ProductResponse response = productService.create(request);

        return ResponseEntity.ok(
                ApiResponse.ok(response, "Product created")
        );
    }

    // ✅ ADMIN UPDATE
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Auth")
    @Operation(summary = "Update product [ADMIN]")
    public ResponseEntity<ApiResponse<ProductResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request   // 🔥 FIX
    ) {

        ProductResponse response = productService.update(id, request);

        return ResponseEntity.ok(
                ApiResponse.ok(response, "Product updated")
        );
    }

    // ✅ ADMIN DELETE (SOFT DELETE)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Auth")
    @Operation(summary = "Soft-delete product [ADMIN]")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {

        productService.delete(id);

        return ResponseEntity.ok(
                ApiResponse.ok(null, "Product removed")
        );
    }
}