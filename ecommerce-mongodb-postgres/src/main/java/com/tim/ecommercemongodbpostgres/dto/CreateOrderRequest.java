package com.tim.ecommercemongodbpostgres.dto;

public record CreateOrderRequest(
        Long customerId,
        String productId,
        Integer quantity
) {}