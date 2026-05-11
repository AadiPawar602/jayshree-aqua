package com.jayshreeaqua.dto.request;

import com.jayshreeaqua.model.Product;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @NotBlank
    private String name;

    private String description;

    private Product.WaterType waterType;

    
    private Product.BottleSize bottleSize;
    
    @NotNull
    private Product.ProductCategory category;

    @NotNull
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal pricePerUnit;

    private String imageUrl;
}