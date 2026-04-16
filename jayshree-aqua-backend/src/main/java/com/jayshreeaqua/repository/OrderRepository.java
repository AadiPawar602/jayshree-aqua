package com.jayshreeaqua.repository;

import com.jayshreeaqua.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    Page<Order> findByUserUserId(Long userId, Pageable pageable);
    List<Order> findByStatus(Order.OrderStatus status);
    List<Order> findByOrderType(Order.OrderType orderType);
    List<Order> findByDeliveryDate(LocalDate date);
    @Query("SELECT o FROM Order o WHERE o.user.userId = :userId ORDER BY o.createdAt DESC")
    List<Order> findRecentOrdersByUser(@Param("userId") Long userId);
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    long countByStatus(@Param("status") Order.OrderStatus status);
}
