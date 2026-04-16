package com.jayshreeaqua.dto.request;

import com.jayshreeaqua.model.Subscription;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class SubscriptionRequest {
    @NotNull private Long productId;
    @NotNull private Subscription.PlanType planType;
    @NotNull private Subscription.DeliveryFrequency frequency;
    @Min(1)  private Integer bottlesPerDelivery;

    @NotBlank
    private String deliveryAddress;

    private String deliveryTimeSlot;

    @NotNull @FutureOrPresent
    private LocalDate startDate;
}
