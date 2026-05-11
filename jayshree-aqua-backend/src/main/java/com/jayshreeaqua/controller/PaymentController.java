package com.jayshreeaqua.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jayshreeaqua.service.OrderService;
import com.jayshreeaqua.service.RazorpayService;
import com.jayshreeaqua.util.RazorpayUtil;
import com.razorpay.Order;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderService orderService;
    private final RazorpayUtil razorpayUtil;

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) {

        String orderId = data.get("razorpay_order_id");
        String paymentId = data.get("razorpay_payment_id");
        String signature = data.get("razorpay_signature");

        boolean isValid = razorpayUtil.verifySignature(orderId, paymentId, signature);

        if (!isValid) {
            return ResponseEntity.badRequest().body("Invalid payment signature");
        }

        orderService.markAsPaid(orderId, paymentId, signature);

        return ResponseEntity.ok("Payment verified & order updated");
    }
}