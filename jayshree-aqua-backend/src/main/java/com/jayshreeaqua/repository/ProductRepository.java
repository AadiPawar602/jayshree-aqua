package com.jayshreeaqua.repository;

import com.jayshreeaqua.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByIsAvailableTrue();
    List<Product> findByWaterType(Product.WaterType waterType);
    List<Product> findByBottleSize(Product.BottleSize size);
    Optional<Product> findBySku(String sku);
    List<Product> findByWaterTypeAndIsAvailableTrue(Product.WaterType waterType);
    Optional<Product> findByProductIdAndIsAvailableTrue(Long productId);
}
