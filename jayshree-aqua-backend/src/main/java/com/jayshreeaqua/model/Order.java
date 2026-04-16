package com.jayshreeaqua.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

/**
 * Order Entity — single purchase or event bulk order.
 * Oracle table: JA_ORDERS
 */
@Entity
@Table(name = "JA_ORDERS")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Order extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_seq")
    @SequenceGenerator(name = "order_seq", sequenceName = "JA_ORDER_SEQ", allocationSize = 1)
    @Column(name = "ORDER_ID")
    private Long orderId;

    @Column(name = "ORDER_NUMBER", unique = true, nullable = false, length = 20)
    private String orderNumber;     // e.g. JA-2024-000123

    // ── Relations ─────────────────────────────────────────────
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @JsonManagedReference
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> orderItems = new ArrayList<>();

    // ── Order Type ────────────────────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(name = "ORDER_TYPE", nullable = false, length = 20)
    @Builder.Default
    private OrderType orderType = OrderType.ONE_TIME;

    // ── Status ────────────────────────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false, length = 20)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    // ── Financials ────────────────────────────────────────────
    @Column(name = "SUBTOTAL", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "DELIVERY_CHARGE", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal deliveryCharge = BigDecimal.ZERO;

    @Column(name = "DISCOUNT", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "TOTAL_AMOUNT", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    // ── Delivery ──────────────────────────────────────────────
    @Column(name = "DELIVERY_ADDRESS", length = 400)
    private String deliveryAddress;

    @Column(name = "DELIVERY_DATE")
    private LocalDate deliveryDate;

    @Column(name = "DELIVERY_NOTES", length = 300)
    private String deliveryNotes;

    // ── Payment ───────────────────────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(name = "PAYMENT_STATUS", length = 20)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "PAYMENT_METHOD", length = 30)
    private String paymentMethod;   // UPI, CASH, CARD, NETBANKING

    @Column(name = "PAYMENT_REF", length = 100)
    private String paymentRef;

    // ── Event-specific ────────────────────────────────────────
    @Column(name = "EVENT_NAME", length = 100)
    private String eventName;       // Populated for EVENT orders

    @Column(name = "EVENT_DATE")
    private LocalDate eventDate;

    // ── Enums ─────────────────────────────────────────────────
    public enum OrderType {
        ONE_TIME, EVENT
    }

    public enum OrderStatus {
        PENDING, CONFIRMED, PROCESSING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, REFUNDED
    }

    public enum PaymentStatus {
        PENDING, PAID, FAILED, REFUNDED
    }
    
    public void calculateTotals() {
        this.subtotal = orderItems.stream()
            .map(item -> item.getUnitPrice()
                .multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        this.totalAmount = subtotal
            .add(deliveryCharge)
            .subtract(discount);
    }

    // ── Helper ────────────────────────────────────────────────
    public void addItem(OrderItem item) {
        orderItems.add(item);
        item.setOrder(this);
    }
}
