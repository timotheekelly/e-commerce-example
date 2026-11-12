package com.tim.ecommercemongodbpostgres.repository;

import com.tim.ecommercemongodbpostgres.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByCustomer_Id(Long customerId);
}