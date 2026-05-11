package com.jayshreeaqua.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jayshreeaqua.dto.request.OrderRequest;
import com.jayshreeaqua.dto.response.OrderResponse;
import com.jayshreeaqua.dto.response.OrderResponse.OrderItemResponse;
import com.jayshreeaqua.model.Order;
import com.jayshreeaqua.model.Order.OrderStatus;
import com.jayshreeaqua.model.Order.PaymentStatus;
import com.jayshreeaqua.model.OrderItem;
import com.jayshreeaqua.model.Product;
import com.jayshreeaqua.model.User;
import com.jayshreeaqua.repository.OrderRepository;
import com.jayshreeaqua.repository.ProductRepository;
import com.jayshreeaqua.repository.UserRepository;
import com.jayshreeaqua.service.OrderService;
import com.jayshreeaqua.service.RazorpayService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final RazorpayService razorpayService;

    @Override
    @Transactional
    public OrderResponse placeOrder(OrderRequest request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber("JA-" + System.currentTimeMillis());
        order.setOrderType(request.getOrderType());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setDeliveryDate(request.getDeliveryDate());
        order.setPaymentStatus(Order.PaymentStatus.PENDING);
        order.setPaymentMethod(request.getPaymentMethod());

        // 🔹 Add items
        for (OrderRequest.OrderItemRequest i : request.getItems()) {

            Product product = productRepository.findById(i.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setQuantity(i.getQuantity());

            BigDecimal price = product.getPricePerUnit();
            item.setPrice(price);
            item.setLineTotal(price.multiply(BigDecimal.valueOf(i.getQuantity())));

            order.addItem(item);
        }

        order.calculateTotals();

        // 🔥 CREATE RAZORPAY ORDER HERE
        try {
            com.razorpay.Order razorOrder =
                    razorpayService.createOrder(order.getTotalAmount());

            // 🔥 SAVE THIS (MOST IMPORTANT LINE)
            order.setRazorpayOrderId(razorOrder.get("id"));

        } catch (Exception e) {
        	e.printStackTrace();
            throw new RuntimeException("Payment initialization failed");
        }

        Order saved = orderRepository.save(order);
        System.out.println("RAZORPAY ORDER ID = " + saved.getRazorpayOrderId());

        return OrderResponse.builder()
                .orderId(saved.getOrderId())
                .orderNumber(saved.getOrderNumber())
                .totalAmount(saved.getTotalAmount())
                .razorpayOrderId(saved.getRazorpayOrderId())
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByUser(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Order> orders = orderRepository.findByUserWithItems(user);

        return orders.stream()
        	    .map(order -> {

        	        List<OrderItemResponse> items = order.getItems() == null
        	            ? List.of()
        	            : order.getItems().stream()
        	                .map(item -> {

        	                    Product product = item.getProduct();

        	                    return OrderItemResponse.builder()
        	                        .itemId(item.getItemId())
        	                        .productId(product != null ? product.getProductId() : null)
        	                        .productName(product != null ? product.getName() : "Unknown Product")
        	                        .bottleSize(product != null && product.getBottleSize() != null
        	                            ? product.getBottleSize().getLabel()
        	                            : "")
        	                        .quantity(item.getQuantity())
        	                        .price(item.getPrice())
        	                        .lineTotal(item.getLineTotal())
        	                        .build();
        	                })
        	                .collect(Collectors.toList());

        	        return OrderResponse.builder()
        	            .orderId(order.getOrderId())
        	            .orderNumber(order.getOrderNumber())
        	            .status(order.getStatus())
        	            .totalAmount(order.getTotalAmount())
        	            .createdAt(order.getCreatedAt())
        	            .items(items)
        	            .build();
        	    })
        	    .collect(Collectors.toList());
    }
    
    
    @Override
    @Transactional
    public void cancelOrder(Long orderId, String email) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // 🔐 SECURITY CHECK
        if (!order.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized action");
        }

        // ❌ Business rule
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Only pending orders can be cancelled");
        }

        order.setStatus(OrderStatus.CANCELLED);

        orderRepository.save(order);
    }
    
    
    
    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {

        List<Order> orders = orderRepository.findAllWithItems();

        return orders.stream()
            .map(order -> {

                List<OrderItemResponse> items = order.getItems() == null
                    ? List.of()
                    : order.getItems().stream()
                        .map(item -> {
                            Product product = item.getProduct();

                            return OrderItemResponse.builder()
                                .itemId(item.getItemId())
                                .productId(product != null ? product.getProductId() : null)
                                .productName(product != null ? product.getName() : "Unknown Product")
                                .bottleSize(product != null && product.getBottleSize() != null
                                    ? product.getBottleSize().getLabel()
                                    : "")
                                .quantity(item.getQuantity())
                                .price(item.getPrice())
                                .lineTotal(item.getLineTotal())
                                .build();
                        })
                        .toList();

                return OrderResponse.builder()
                    .orderId(order.getOrderId())
                    .orderNumber(order.getOrderNumber())
                    .status(order.getStatus())
                    .totalAmount(order.getTotalAmount())
                    .createdAt(order.getCreatedAt())
                    .items(items)
                    .build();
            })
            .toList();
    }

    @Override
    @Transactional
    public void updateOrderStatus(Long orderId, String status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        try {
        	String cleanStatus = status.replace("\"", "").trim();
        	OrderStatus newStatus = OrderStatus.valueOf(cleanStatus.toUpperCase());
            order.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value");
        }

        orderRepository.save(order);
    }
    
    @Override
    @Transactional
    public void markAsPaid(String razorpayOrderId, String paymentId, String signature) {

        Order order = orderRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // 🔥 PREVENT DUPLICATE
        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            return;
        }

        order.setRazorpayPaymentId(paymentId);
        order.setRazorpaySignature(signature);
        order.setPaymentStatus(Order.PaymentStatus.PAID);
        order.setStatus(Order.OrderStatus.CONFIRMED);

        orderRepository.save(order);
    }
}