package com.jayshreeaqua.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jayshreeaqua.model.Order;
import com.jayshreeaqua.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    List<User> findByIsActiveTrue();
    @Query("SELECT u FROM User u WHERE u.role = 'CUSTOMER' AND u.isActive = true")
    List<User> findAllActiveCustomers();
}
