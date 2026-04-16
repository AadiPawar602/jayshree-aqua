package com.jayshreeaqua.service.impl;

import com.jayshreeaqua.dto.response.ProductResponse;
import com.jayshreeaqua.exception.ResourceNotFoundException;
import com.jayshreeaqua.model.Product;
import com.jayshreeaqua.repository.ProductRepository;
import com.jayshreeaqua.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<ProductResponse> getAllAvailable() {
        return productRepository.findByIsAvailableTrue()
                .stream().map(this::toResponse).toList();
    }

    @Override
    public List<ProductResponse> getByWaterType(Product.WaterType type) {
        return productRepository.findByWaterTypeAndIsAvailableTrue(type)
                .stream().map(this::toResponse).toList();
    }

    @Override
    public ProductResponse getById(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return toResponse(p);
    }

    @Override
    @Transactional
    public ProductResponse create(Product product) {
        return toResponse(productRepository.save(product));
    }

    @Override
    @Transactional
    public ProductResponse update(Long id, Product updated) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        p.setName(updated.getName());
        p.setDescription(updated.getDescription());
        p.setPricePerUnit(updated.getPricePerUnit());
        p.setStockQuantity(updated.getStockQuantity());
        p.setIsAvailable(updated.getIsAvailable());
        p.setImageUrl(updated.getImageUrl());
        return toResponse(productRepository.save(p));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        p.setIsAvailable(false);
        productRepository.save(p);     // soft delete
    }

    private ProductResponse toResponse(Product p) {
        ProductResponse r = modelMapper.map(p, ProductResponse.class);
        r.setSizeLabel(p.getBottleSize().getLabel());
        return r;
    }
}
