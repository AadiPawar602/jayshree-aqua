package com.jayshreeaqua.repository;

import com.jayshreeaqua.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUserUserId(Long userId);
    Optional<Subscription> findBySubscriptionCode(String code);
    List<Subscription> findByStatus(Subscription.SubscriptionStatus status);
    @Query("SELECT s FROM Subscription s WHERE s.nextDeliveryDate = :date AND s.status = 'ACTIVE'")
    List<Subscription> findDueForDelivery(@Param("date") LocalDate date);
    @Query("SELECT s FROM Subscription s WHERE s.user.userId = :userId AND s.status = 'ACTIVE'")
    List<Subscription> findActiveByUser(@Param("userId") Long userId);
}
