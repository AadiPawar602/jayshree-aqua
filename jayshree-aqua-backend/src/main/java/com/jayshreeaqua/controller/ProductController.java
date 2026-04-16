package com.jayshreeaqua.controller;

import com.jayshreeaqua.dto.response.ApiResponse;
import com.jayshreeaqua.dto.response.ProductResponse;
import com.jayshreeaqua.model.Product;
import com.jayshreeaqua.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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

    @GetMapping
    @Operation(summary = "Get all available products")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(productService.getAllAvailable(), "Products fetched"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<ApiResponse<ProductResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getById(id), "Product found"));
    }

    @GetMapping("/type/{waterType}")
    @Operation(summary = "Get products by water type (FILTERED / COLD_FILTERED)")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getByType(
            @PathVariable Product.WaterType waterType) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getByWaterType(waterType), "Products fetched"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Auth")
    @Operation(summary = "Add new product [ADMIN]")
    public ResponseEntity<ApiResponse<ProductResponse>> create(@RequestBody Product product) {
        return ResponseEntity.ok(ApiResponse.ok(productService.create(product), "Product created"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Auth")
    @Operation(summary = "Update product [ADMIN]")
    public ResponseEntity<ApiResponse<ProductResponse>> update(
            @PathVariable Long id, @RequestBody Product product) {
        return ResponseEntity.ok(ApiResponse.ok(productService.update(id, product), "Product updated"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Auth")
    @Operation(summary = "Soft-delete product [ADMIN]")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Product removed"));
    }
}
