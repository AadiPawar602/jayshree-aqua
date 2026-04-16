package com.jayshreeaqua.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Subscription Entity — recurring monthly water delivery plan.
 * Oracle table: JA_SUBSCRIPTIONS
 */
@Entity
@Table(name = "JA_SUBSCRIPTIONS")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Subscription extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sub_seq")
    @SequenceGenerator(name = "sub_seq", sequenceName = "JA_SUBSCRIPTION_SEQ", allocationSize = 1)
    @Column(name = "SUBSCRIPTION_ID")
    private Long subscriptionId;

    @Column(name = "SUBSCRIPTION_CODE", unique = true, nullable = false, length = 20)
    private String subscriptionCode;    // e.g. SUB-2024-000045

    // ── Relations ─────────────────────────────────────────────
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private Product product;

    // ── Plan Details ──────────────────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(name = "PLAN_TYPE", nullable = false, length = 20)
    private PlanType planType;

    @Column(name = "BOTTLES_PER_DELIVERY", nullable = false)
    private Integer bottlesPerDelivery;

    @Enumerated(EnumType.STRING)
    @Column(name = "FREQUENCY", nullable = false, length = 20)
    private DeliveryFrequency frequency;

    @Column(name = "MONTHLY_AMOUNT", nullable = false, precision = 10, scale = 2)
    private BigDecimal monthlyAmount;

    // ── Dates ─────────────────────────────────────────────────
    @Column(name = "START_DATE", nullable = false)
    private LocalDate startDate;

    @Column(name = "END_DATE")
    private LocalDate endDate;          // null = open-ended

    @Column(name = "NEXT_DELIVERY_DATE")
    private LocalDate nextDeliveryDate;

    @Column(name = "LAST_DELIVERY_DATE")
    private LocalDate lastDeliveryDate;

    // ── Status ────────────────────────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false, length = 20)
    @Builder.Default
    private SubscriptionStatus status = SubscriptionStatus.ACTIVE;

    @Column(name = "PAUSE_REASON", length = 200)
    private String pauseReason;

    // ── Delivery ──────────────────────────────────────────────
    @Column(name = "DELIVERY_ADDRESS", nullable = false, length = 400)
    private String deliveryAddress;

    @Column(name = "DELIVERY_TIME_SLOT", length = 30)
    private String deliveryTimeSlot;    // e.g. "06:00-09:00"

    // ── Enums ─────────────────────────────────────────────────
    public enum PlanType {
        STARTER,    // 30 × 1L
        FAMILY,     // 20 × 5L
        BUSINESS    // 15 × 10L
    }

    public enum DeliveryFrequency {
        DAILY, ALTERNATE_DAY, WEEKLY, TWICE_WEEKLY
    }

    public enum SubscriptionStatus {
        ACTIVE, PAUSED, CANCELLED, EXPIRED
    }
}
