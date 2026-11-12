package com.tim.ecommercemongodbpostgres.dto;

import com.tim.ecommercemongodbpostgres.model.Customer;
import com.tim.ecommercemongodbpostgres.model.Product;

import java.math.BigDecimal;

public record OrderDetailsResponse(
        Long orderId,
        Customer customer,
        Product product,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal total
) {}