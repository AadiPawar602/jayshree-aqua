package com.jayshreeaqua.config;

import com.jayshreeaqua.model.Product;
import com.jayshreeaqua.model.User;
import com.jayshreeaqua.repository.ProductRepository;
import com.jayshreeaqua.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * Seeds default admin user and sample products on first run.
 * Remove or disable after production setup.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedProducts();
    }

    private void seedAdmin() {
        if (userRepository.existsByEmail("admin@jayshreeaqua.com")) return;

        User admin = User.builder()
                .fullName("Jayshree Aqua Admin")
                .email("admin@jayshreeaqua.com")
                .phone("9000000000")
                .passwordHash(passwordEncoder.encode("Admin@123"))
                .role(User.Role.ADMIN)
                .isActive(true)
                .city("Pimpri-Chinchwad")
                .build();

        userRepository.save(admin);
        log.info("✅ Admin user seeded → admin@jayshreeaqua.com / Admin@123");
    }

    private void seedProducts() {
        if (productRepository.count() > 0) return;

        List<Product> products = List.of(
            // ── Filtered Water ────────────────────────────────────
            product("RO Filtered Water 500ml", Product.WaterType.FILTERED,
                    Product.BottleSize.ML_500, "10.00", "RO-500ML-001", 500),
            product("RO Filtered Water 1L",   Product.WaterType.FILTERED,
                    Product.BottleSize.L_1,    "18.00", "RO-1L-001",    300),
            product("RO Filtered Water 2L",   Product.WaterType.FILTERED,
                    Product.BottleSize.L_2,    "30.00", "RO-2L-001",    200),
            product("RO Filtered Water 5L",   Product.WaterType.FILTERED,
                    Product.BottleSize.L_5,    "60.00", "RO-5L-001",    150),
            product("RO Filtered Water 10L",  Product.WaterType.FILTERED,
                    Product.BottleSize.L_10,   "100.00","RO-10L-001",   100),

            // ── Cold Filtered Water ───────────────────────────────
            product("Cold Filtered Water 500ml", Product.WaterType.COLD_FILTERED,
                    Product.BottleSize.ML_500, "15.00", "CF-500ML-001", 300),
            product("Cold Filtered Water 1L",   Product.WaterType.COLD_FILTERED,
                    Product.BottleSize.L_1,    "25.00", "CF-1L-001",    200),
            product("Cold Filtered Water 2L",   Product.WaterType.COLD_FILTERED,
                    Product.BottleSize.L_2,    "40.00", "CF-2L-001",    150),
            product("Cold Filtered Water 5L",   Product.WaterType.COLD_FILTERED,
                    Product.BottleSize.L_5,    "80.00", "CF-5L-001",    100),
            product("Cold Filtered Water 10L",  Product.WaterType.COLD_FILTERED,
                    Product.BottleSize.L_10,   "140.00","CF-10L-001",    80)
        );

        productRepository.saveAll(products);
        log.info("✅ {} sample products seeded", products.size());
    }

    private Product product(String name, Product.WaterType type,
                            Product.BottleSize size, String price,
                            String sku, int stock) {
        return Product.builder()
                .name(name)
                .waterType(type)
                .bottleSize(size)
                .pricePerUnit(new BigDecimal(price))
                .sku(sku)
                .stockQuantity(stock)
                .isAvailable(true)
                .build();
    }
}
