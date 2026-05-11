package com.jayshreeaqua.service;

import java.math.BigDecimal;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Service
@Data
@Getter@Setter
public class RazorpayService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    public Order createOrder(BigDecimal amount) throws Exception {

        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        JSONObject options = new JSONObject();
        options.put("amount", amount.multiply(BigDecimal.valueOf(100)).intValue()); 
        options.put("currency", "INR");
        options.put("receipt", "txn_" + System.currentTimeMillis());

        return client.orders.create(options);
    }
}