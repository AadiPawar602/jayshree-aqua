package com.jayshreeaqua.dto.response;

import com.jayshreeaqua.model.Order;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class OrderResponse {
    private Long orderId;
    private String orderNumber;
    private Order.OrderType orderType;
    private Order.OrderStatus status;
    private BigDecimal subtotal;
    private BigDecimal deliveryCharge;
    private BigDecimal discount;
    private BigDecimal totalAmount;
    private String razorpayOrderId;
    private String deliveryAddress;
    private LocalDate deliveryDate;
    private Order.PaymentStatus paymentStatus;
    private String paymentMethod;
    private String eventName;
    private LocalDate eventDate;
    private List<OrderItemResponse> items;
    private LocalDateTime createdAt;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class OrderItemResponse {
        private Long itemId;
        private Long productId;
        private String productName;
        private String bottleSize;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal lineTotal;
    }
}
