package com.jayshreeaqua.service.impl;

import java.math.BigDecimal;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jayshreeaqua.dto.request.ProductRequest;
import com.jayshreeaqua.dto.response.ProductResponse;
import com.jayshreeaqua.exception.ResourceNotFoundException;
import com.jayshreeaqua.model.Product;
import com.jayshreeaqua.repository.ProductRepository;
import com.jayshreeaqua.service.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    // ✅ GET ALL
    @Override
    public List<ProductResponse> getAllAvailable() {
        return productRepository.findByIsAvailableTrue()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ✅ FILTER
    @Override
    public List<ProductResponse> getByWaterType(Product.WaterType type) {
        return productRepository.findByWaterTypeAndIsAvailableTrue(type)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ✅ GET BY ID
    @Override
    public ProductResponse getById(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        return toResponse(p);
    }

    // ✅ CREATE (FIXED)
    @Override
    @Transactional
    public ProductResponse create(ProductRequest request) {

        Product product = new Product();

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setPricePerUnit(request.getPricePerUnit());
        product.setImageUrl(request.getImageUrl());
        product.setStockQuantity(100);
        product.setIsAvailable(true);

        // ✅ CONDITIONAL LOGIC
        if (request.getCategory() == Product.ProductCategory.WATER) {
            product.setWaterType(request.getWaterType());
            product.setBottleSize(request.getBottleSize());
        } else if (request.getCategory() == Product.ProductCategory.JAR) {
            product.setBottleSize(request.getBottleSize());
        }

        return toResponse(productRepository.save(product));
    }

    // ✅ UPDATE (FIXED)
    @Override
    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {

        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        p.setName(request.getName());
        p.setDescription(request.getDescription());
        p.setWaterType(request.getWaterType());
        p.setBottleSize(request.getBottleSize());
        p.setPricePerUnit(request.getPricePerUnit());
        p.setImageUrl(request.getImageUrl());

        // optional improvement
        if (p.getStockQuantity() == null) {
            p.setStockQuantity(100);
        }

        return toResponse(productRepository.save(p));
    }

    // ✅ SOFT DELETE
    @Override
    @Transactional
    public void delete(Long id) {

        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        p.setIsAvailable(false);

        productRepository.save(p);
    }

    // ✅ MAPPER
    private ProductResponse toResponse(Product p) {

        ProductResponse r = modelMapper.map(p, ProductResponse.class);

        if (p.getBottleSize() != null) {
            r.setSizeLabel(p.getBottleSize().getLabel());
        }

        // ensure no null crashes
        if (p.getPricePerUnit() == null) {
            r.setPricePerUnit(BigDecimal.ZERO);
        }

        return r;
    }
}