package com.jayshreeaqua.controller;

import com.jayshreeaqua.dto.request.SubscriptionRequest;
import com.jayshreeaqua.dto.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/subscriptions")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Auth")
@Tag(name = "Subscriptions", description = "Monthly water delivery plans — Full impl in Phase 5")
public class SubscriptionController {

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Subscribe to a plan [Phase 5]")
    public ResponseEntity<ApiResponse<String>> subscribe(@Valid @RequestBody SubscriptionRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("SUB_PLACEHOLDER", "Subscription endpoint ready — Phase 5 coming up!"));
    }
}
