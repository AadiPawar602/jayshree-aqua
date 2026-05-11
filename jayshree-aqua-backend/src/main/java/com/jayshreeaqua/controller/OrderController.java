package com.jayshreeaqua.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jayshreeaqua.dto.request.OrderRequest;
import com.jayshreeaqua.dto.response.ApiResponse;
import com.jayshreeaqua.dto.response.OrderResponse;
import com.jayshreeaqua.service.OrderService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Auth")
@Tag(name = "Orders", description = "One-time and event orders — Full impl in Phase 4")
public class OrderController {

	private final OrderService orderService;
	
	@PostMapping
    public ResponseEntity<?> placeOrder(
            @RequestBody OrderRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        OrderResponse response =
                orderService.placeOrder(request, userDetails.getUsername());

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Order placed successfully",
                "data", response   // ✅ THIS IS THE FIX
        ));
    }

    // ✅ GET USER ORDERS
    @GetMapping("/my")
    public ResponseEntity<?> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", orderService.getOrdersByUser(userDetails.getUsername())
        ));
    }

    // ✅ CANCEL ORDER
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id,
                                         @AuthenticationPrincipal UserDetails userDetails) {

        orderService.cancelOrder(id, userDetails.getUsername());

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Order cancelled"
        ));
    }
	
	
	
	@GetMapping("/admin/all")
	@PreAuthorize("hasRole('ADMIN')")
	@Operation(summary = "Get all orders (Admin)")
	public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {

	    List<OrderResponse> orders = orderService.getAllOrders();

	    return ResponseEntity.ok(ApiResponse.ok(orders, "All orders fetched"));
	}

	@PutMapping("/{orderId}/status")
	@PreAuthorize("hasRole('ADMIN')")
	@Operation(summary = "Update order status (Admin)")
	public ResponseEntity<ApiResponse<String>> updateOrderStatus(
	        @PathVariable Long orderId,
	        @RequestBody String status
	) {

	    orderService.updateOrderStatus(orderId, status);

	    return ResponseEntity.ok(ApiResponse.ok("SUCCESS", "Order status updated"));
	}
}
