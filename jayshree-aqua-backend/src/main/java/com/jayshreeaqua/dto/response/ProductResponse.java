package com.jayshreeaqua.dto.response;

import com.jayshreeaqua.model.Product;
import lombok.*;
import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProductResponse {
    private Long productId;
    private String name;
    private String description;
    private Product.WaterType waterType;
    private Product.BottleSize bottleSize;
    private String sizeLabel;
    private BigDecimal pricePerUnit;
    private Integer stockQuantity;
    private Boolean isAvailable;
    private String imageUrl;
    private String sku;
}
