package com.jayshreeaqua.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jayshreeaqua.dto.request.OrderRequest;
import com.jayshreeaqua.model.*;
import com.jayshreeaqua.repository.*;
import com.jayshreeaqua.service.OrderService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public void placeOrder(OrderRequest request, String email) {

        // 🔹 Get User
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔹 Create Order
        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber("JA-" + System.currentTimeMillis());
        order.setOrderType(request.getOrderType());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setDeliveryDate(request.getDeliveryDate());

        // 🔹 Add Items
        for (OrderRequest.OrderItemRequest i : request.getItems()) {

            Product product = productRepository.findById(i.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setQuantity(i.getQuantity());

            BigDecimal price = product.getPricePerUnit();
            item.setUnitPrice(price);

            item.setLineTotal(
                price.multiply(BigDecimal.valueOf(i.getQuantity()))
            );

            order.addItem(item); // 🔥 important
        }

        // 🔹 Calculate Total
        order.calculateTotals();

        // 🔹 Save
        orderRepository.save(order);
    }
}