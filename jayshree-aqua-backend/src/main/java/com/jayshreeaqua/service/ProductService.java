package com.jayshreeaqua.service;

import com.jayshreeaqua.dto.response.ProductResponse;
import com.jayshreeaqua.model.Product;
import java.util.List;

public interface ProductService {
    List<ProductResponse> getAllAvailable();
    List<ProductResponse> getByWaterType(Product.WaterType type);
    ProductResponse getById(Long id);
    ProductResponse create(Product product);
    ProductResponse update(Long id, Product product);
    void delete(Long id);
}
