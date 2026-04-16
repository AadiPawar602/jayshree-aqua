package com.jayshreeaqua.service;

import com.jayshreeaqua.dto.request.OrderRequest;

public interface OrderService {
	void placeOrder(OrderRequest request, String email);
}
