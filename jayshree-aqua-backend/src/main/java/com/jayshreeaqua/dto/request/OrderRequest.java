package com.jayshreeaqua.dto.request;

import com.jayshreeaqua.model.Order;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class OrderRequest {
    @NotEmpty
    private List<OrderItemRequest> items;

    @NotBlank
    private String deliveryAddress;

    @NotNull @Future
    private LocalDate deliveryDate;

    private String deliveryNotes;
    private String paymentMethod;

    @NotNull
    private Order.OrderType orderType;

    // Event fields
    private String eventName;
    private LocalDate eventDate;

    @Data
    public static class OrderItemRequest {
        @NotNull 
        private Long productId;
        
        @NotNull
        @Min(1)
        private Integer quantity;
    }
}
