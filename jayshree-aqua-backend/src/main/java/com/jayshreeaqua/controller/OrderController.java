package com.jayshreeaqua.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jayshreeaqua.dto.request.OrderRequest;
import com.jayshreeaqua.dto.response.ApiResponse;
import com.jayshreeaqua.service.OrderService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Auth")
@Tag(name = "Orders", description = "One-time and event orders — Full impl in Phase 4")
public class OrderController {

	private final OrderService orderService;
	
	@PostMapping
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Place an order")
	public ResponseEntity<ApiResponse<String>> placeOrder(
	        @Valid @RequestBody OrderRequest request,
	        Authentication auth) {

	    String email = auth.getName();

	    orderService.placeOrder(request, email);

	    return ResponseEntity.ok(ApiResponse.ok("SUCCESS", "Order placed successfully"));
	}
}
