package com.jayshreeaqua.controller;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jayshreeaqua.service.OrderService;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

@RestController
@RequestMapping("/api")
public class RazorpayWebhookController {

    @Value("${razorpay.webhook.secret}")
    private String webhookSecret;

    private final OrderService orderService;

    public RazorpayWebhookController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestHeader("X-Razorpay-Signature") String signature,
            @RequestBody String payload) {

        try {

            System.out.println("🔥 WEBHOOK RECEIVED");
            System.out.println("Payload: " + payload);

            boolean isValid = verifyWebhookSignature(payload, signature, webhookSecret);

            if (!isValid) {
                System.out.println("❌ Invalid signature");
                return ResponseEntity.status(400).body("Invalid signature");
            }

            System.out.println("✅ Signature verified");

            JSONObject json = new JSONObject(payload);
            String event = json.getString("event");

            System.out.println("📌 Event: " + event);

            if ("payment.captured".equals(event)) {

                JSONObject payment = json
                        .getJSONObject("payload")
                        .getJSONObject("payment")
                        .getJSONObject("entity");

                String razorpayOrderId = payment.getString("order_id");
                String paymentId = payment.getString("id");

                System.out.println("💰 Payment captured for order: " + razorpayOrderId);

                orderService.markAsPaid(razorpayOrderId, paymentId, "webhook");
            }

            return ResponseEntity.ok("Webhook processed");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error");
        }
    }

    // ✅ FIXED: HEX signature (NOT Base64)
    private boolean verifyWebhookSignature(String payload, String actualSignature, String secret) throws Exception {

        String expectedSignature = hmacSHA256(payload, secret);

        return expectedSignature.equals(actualSignature);
    }

    private String hmacSHA256(String data, String key) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");

        SecretKeySpec secretKey =
                new SecretKeySpec(key.getBytes(), "HmacSHA256");

        mac.init(secretKey);

        byte[] hash = mac.doFinal(data.getBytes());

        // 🔥 HEX conversion (IMPORTANT)
        StringBuilder hex = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            String hexChar = Integer.toHexString(0xff & b);
            if (hexChar.length() == 1) hex.append('0');
            hex.append(hexChar);
        }

        return hex.toString();
    }
}