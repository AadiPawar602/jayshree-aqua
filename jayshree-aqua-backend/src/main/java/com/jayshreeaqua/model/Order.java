package com.jayshreeaqua.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

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
    private String orderNumber;

    // ── RELATION ──────────────────────────────────────────────
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    // ── ORDER TYPE ────────────────────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(name = "ORDER_TYPE", nullable = false)
    @Builder.Default
    private OrderType orderType = OrderType.ONE_TIME;

    // ── STATUS ────────────────────────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    // ── FINANCIALS ────────────────────────────────────────────
    @Column(name = "SUBTOTAL", nullable = false)
    private BigDecimal subtotal;

    @Builder.Default
    @Column(name = "DELIVERY_CHARGE")
    private BigDecimal deliveryCharge = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "DISCOUNT")
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "TOTAL_AMOUNT", nullable = false)
    private BigDecimal totalAmount;

    // ── DELIVERY ──────────────────────────────────────────────
    @Column(name = "DELIVERY_ADDRESS")
    private String deliveryAddress;

    @Column(name = "DELIVERY_DATE")
    private LocalDate deliveryDate;

    @Column(name = "DELIVERY_NOTES")
    private String deliveryNotes;

    // ── PAYMENT (🔥 UPDATED) ─────────────────────────────────
    
    @Enumerated(EnumType.STRING)
    @Column(name = "PAYMENT_STATUS")
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "PAYMENT_METHOD")
    private String paymentMethod; // UPI, CARD, CASH

    // 🔥 Razorpay fields (IMPORTANT)
    @Column(name = "RAZORPAY_ORDER_ID")
    private String razorpayOrderId;

    @Column(name = "RAZORPAY_PAYMENT_ID")
    private String razorpayPaymentId;

    @Column(name = "RAZORPAY_SIGNATURE")
    private String razorpaySignature;

    // ── EVENT ────────────────────────────────────────────────
    @Column(name = "EVENT_NAME")
    private String eventName;

    @Column(name = "EVENT_DATE")
    private LocalDate eventDate;

    // ── ITEMS ────────────────────────────────────────────────
    @JsonManagedReference
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    // ── ENUMS ────────────────────────────────────────────────
    public enum OrderType {
        ONE_TIME, EVENT
    }

    public enum OrderStatus {
        PENDING, CONFIRMED, PROCESSING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, REFUNDED
    }

    public enum PaymentStatus {
        PENDING, PAID, FAILED, REFUNDED
    }

    // ── BUSINESS LOGIC ───────────────────────────────────────
    public void calculateTotals() {
        this.subtotal = items.stream()
                .map(item -> item.getPrice()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        this.totalAmount = subtotal
                .add(deliveryCharge)
                .subtract(discount);
    }

    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
}