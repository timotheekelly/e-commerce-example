package com.tim.ecommercemongodbpostgres.controller;

import com.tim.ecommercemongodbpostgres.dto.CreateOrderRequest;
import com.tim.ecommercemongodbpostgres.dto.OrderDetailsResponse;
import com.tim.ecommercemongodbpostgres.model.Order;
import com.tim.ecommercemongodbpostgres.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<OrderDetailsResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody CreateOrderRequest request) {
        Order created = orderService.createOrder(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailsResponse> getOrderDetails(@PathVariable Long id) {
        OrderDetailsResponse orderDetailsResponse = orderService.getOrderDetails(id);
        return ResponseEntity.ok(orderDetailsResponse);
    }
}