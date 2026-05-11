package com.jayshreeaqua.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.math.BigDecimal;

/**
 * OrderItem Entity — individual line item in an order.
 * Oracle table: JA_ORDER_ITEMS
 */
@Entity
@Table(name = "JA_ORDER_ITEMS")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_item_seq")
    @SequenceGenerator(name = "order_item_seq", sequenceName = "JA_ORDER_ITEM_SEQ", allocationSize = 1)
    @Column(name = "ITEM_ID")
    private Long itemId;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ORDER_ID", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private Product product;

    @Column(name = "QUANTITY", nullable = false)
    private Integer quantity;

    @Column(name = "UNIT_PRICE", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;       // price at time of order (snapshot)

    @Column(name = "LINE_TOTAL", nullable = false, precision = 10, scale = 2)
    private BigDecimal lineTotal;       // quantity × unitPrice
}
