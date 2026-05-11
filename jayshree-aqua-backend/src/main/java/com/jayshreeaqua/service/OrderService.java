package com.jayshreeaqua.service;

import java.util.List;

import com.jayshreeaqua.dto.request.OrderRequest;
import com.jayshreeaqua.dto.response.OrderResponse;

public interface OrderService {
	OrderResponse placeOrder(OrderRequest request, String email);
	List<OrderResponse> getOrdersByUser(String email);
	void cancelOrder(Long orderId, String email);
	List<OrderResponse> getAllOrders();
	void updateOrderStatus(Long orderId, String status);
	void markAsPaid(String razorpayOrderId, String paymentId, String signature);
}
