package com.jayshreeaqua.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class RazorpayUtil {

    @Value("${razorpay.key.secret}")
    private String secret;

    public boolean verifySignature(String orderId, String paymentId, String signature) {
        try {
            String payload = orderId + "|" + paymentId;

            String expectedSignature = hmacSHA256(payload, secret);

            // 🔥 IMPORTANT: use equalsIgnoreCase (safe for hex)
            return expectedSignature.equalsIgnoreCase(signature);

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private String hmacSHA256(String data, String key) throws Exception {
        javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");

        javax.crypto.spec.SecretKeySpec secretKey =
                new javax.crypto.spec.SecretKeySpec(key.getBytes(), "HmacSHA256");

        mac.init(secretKey);

        byte[] hash = mac.doFinal(data.getBytes());

        // ✅ CONVERT TO HEX (Razorpay requirement)
        StringBuilder hex = new StringBuilder(2 * hash.length);

        for (byte b : hash) {
            String hexStr = Integer.toHexString(0xff & b);
            if (hexStr.length() == 1) {
                hex.append('0');
            }
            hex.append(hexStr);
        }

        return hex.toString();
    }
}