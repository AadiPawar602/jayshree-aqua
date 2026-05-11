package com.jayshreeaqua.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jayshreeaqua.model.Order;
import com.jayshreeaqua.model.User;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    Page<Order> findByUserUserId(Long userId, Pageable pageable);
    List<Order> findByUserUserId(Long userId);
    List<Order> findByStatus(Order.OrderStatus status);
    List<Order> findByOrderType(Order.OrderType orderType);
    List<Order> findByDeliveryDate(LocalDate date);
    @Query("SELECT o FROM Order o WHERE o.user.userId = :userId ORDER BY o.createdAt DESC")
    List<Order> findRecentOrdersByUser(@Param("userId") Long userId);
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    long countByStatus(@Param("status") Order.OrderStatus status);
    List<Order> findByUser(User user);
    @Query("SELECT o FROM Order o JOIN FETCH o.items i JOIN FETCH i.product WHERE o.user = :user")
    List<Order> findByUserWithItems(@Param("user") User user);
    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.product")
    List<Order> findAllWithItems();
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);
}
