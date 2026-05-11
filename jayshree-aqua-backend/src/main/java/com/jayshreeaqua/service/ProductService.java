package com.jayshreeaqua.service;

import java.util.List;

import com.jayshreeaqua.dto.request.ProductRequest;
import com.jayshreeaqua.dto.response.ProductResponse;
import com.jayshreeaqua.model.Product;

public interface ProductService {
    List<ProductResponse> getAllAvailable();
    List<ProductResponse> getByWaterType(Product.WaterType type);
    ProductResponse getById(Long id);
    ProductResponse create(ProductRequest request);
    ProductResponse update(Long id, ProductRequest request);
    void delete(Long id);
}
