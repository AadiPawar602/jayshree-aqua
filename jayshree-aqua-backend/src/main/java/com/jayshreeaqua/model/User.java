package com.jayshreeaqua.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * User Entity — represents customers and admin users.
 * Oracle table: JA_USERS
 */
@Entity
@Table(name = "JA_USERS", uniqueConstraints = {
        @UniqueConstraint(name = "UQ_USER_EMAIL",    columnNames = "EMAIL"),
        @UniqueConstraint(name = "UQ_USER_PHONE",    columnNames = "PHONE")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
    @SequenceGenerator(name = "user_seq", sequenceName = "JA_USER_SEQ", allocationSize = 1)
    @Column(name = "USER_ID")
    private Long userId;

    @Column(name = "FULL_NAME", nullable = false, length = 100)
    private String fullName;

    @Column(name = "EMAIL", nullable = false, length = 100)
    private String email;

    @Column(name = "PHONE", nullable = false, length = 15)
    private String phone;

    @Column(name = "PASSWORD_HASH", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "ROLE", nullable = false, length = 20)
    @Builder.Default
    private Role role = Role.CUSTOMER;

    @Column(name = "IS_ACTIVE", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "EMAIL_VERIFIED", nullable = false)
    @Builder.Default
    private Boolean emailVerified = false;

    // ── Delivery Address ─────────────────────────────────────
    @Column(name = "ADDRESS_LINE1", length = 200)
    private String addressLine1;

    @Column(name = "ADDRESS_LINE2", length = 200)
    private String addressLine2;

    @Column(name = "CITY", length = 60)
    private String city;

    @Column(name = "PINCODE", length = 10)
    private String pincode;

    // ── Relationships ─────────────────────────────────────────
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Order> orders = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Subscription> subscriptions = new ArrayList<>();

    // ── Enum ─────────────────────────────────────────────────
    public enum Role {
        CUSTOMER, ADMIN, DELIVERY_AGENT
    }
}
