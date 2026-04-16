package com.jayshreeaqua.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Product Entity — water bottles in different sizes and types.
 * Oracle table: JA_PRODUCTS
 */
@Entity
@Table(name = "JA_PRODUCTS")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Product extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "product_seq")
    @SequenceGenerator(name = "product_seq", sequenceName = "JA_PRODUCT_SEQ", allocationSize = 1)
    @Column(name = "PRODUCT_ID")
    private Long productId;

    @Column(name = "NAME", nullable = false, length = 100)
    private String name;

    @Column(name = "DESCRIPTION", length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "WATER_TYPE", nullable = false, length = 30)
    private WaterType waterType;

    @Enumerated(EnumType.STRING)
    @Column(name = "BOTTLE_SIZE", nullable = false, length = 10)
    private BottleSize bottleSize;

    @Column(name = "PRICE_PER_UNIT", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerUnit;

    @Column(name = "STOCK_QUANTITY", nullable = false)
    @Builder.Default
    private Integer stockQuantity = 0;

    @Column(name = "IS_AVAILABLE", nullable = false)
    @Builder.Default
    private Boolean isAvailable = true;

    @Column(name = "IMAGE_URL", length = 300)
    private String imageUrl;

    @Column(name = "SKU", unique = true, length = 30)
    private String sku;       // e.g. "RO-500ML-001"

    // ── Enums ─────────────────────────────────────────────────
    public enum WaterType {
        FILTERED,           // Regular RO purified
        COLD_FILTERED       // Chilled RO purified
    }

    public enum BottleSize {
        ML_500("500ml", 0.5),
        L_1("1L", 1.0),
        L_2("2L", 2.0),
        L_5("5L", 5.0),
        L_10("10L", 10.0);

        private final String label;
        private final double litres;

        BottleSize(String label, double litres) {
            this.label = label;
            this.litres = litres;
        }

        public String getLabel() { return label; }
        public double getLitres() { return litres; }
    }
}
