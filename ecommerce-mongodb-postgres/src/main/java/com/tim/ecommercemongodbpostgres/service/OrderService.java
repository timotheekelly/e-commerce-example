package com.tim.ecommercemongodbpostgres.service;

import com.tim.ecommercemongodbpostgres.dto.CreateOrderRequest;
import com.tim.ecommercemongodbpostgres.dto.OrderDetailsResponse;
import com.tim.ecommercemongodbpostgres.model.Customer;
import com.tim.ecommercemongodbpostgres.model.Order;
import com.tim.ecommercemongodbpostgres.model.Product;
import com.tim.ecommercemongodbpostgres.repository.OrderRepository;

import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.NoSuchElementException;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerService customerService;
    private final ProductService productService;

    public OrderService(OrderRepository orderRepository,
                        CustomerService customerService,
                        ProductService productService) {
        this.orderRepository = orderRepository;
        this.customerService = customerService;
        this.productService = productService;
    }

    @Transactional
    public Order createOrder(CreateOrderRequest request) {

        if (request.quantity() == null || request.quantity() <= 0) {
            throw new IllegalArgumentException(
                    "Order quantity must be greater than zero");
        }

        // PostgreSQL: validate the customer
        Customer customer = customerService.getCustomer(
                request.customerId()
        );

        // MongoDB: retrieve the product
        Product product = productService.getProduct(
                request.productId()
        );

        // PostgreSQL: create the order
        Order order = new Order();
        order.setCustomer(customer);
        order.setProductId(product.getId());
        order.setQuantity(request.quantity());

        // Preserve the purchase price
        order.setUnitPrice(product.getPrice());

        return orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDetailsResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();

        // MongoDB: fetch every referenced product in a single query
        Map<String, Product> products = productService
                .getProductsByIds(orders.stream().map(Order::getProductId).distinct().toList())
                .stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));

        return orders.stream()
                .map(o -> new OrderDetailsResponse(
                        o.getId(),
                        (Customer) Hibernate.unproxy(o.getCustomer()),
                        products.get(o.getProductId()),
                        o.getQuantity(),
                        o.getUnitPrice(),
                        o.getUnitPrice().multiply(BigDecimal.valueOf(o.getQuantity()))))
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderDetailsResponse getOrderDetails(Long orderId) {

        // PostgreSQL: retrieve the order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Order not found: " + orderId));

        // MongoDB: retrieve the associated product
        Product product = productService.getProduct(
                order.getProductId()
        );

        BigDecimal total = order.getUnitPrice()
                .multiply(BigDecimal.valueOf(order.getQuantity()));

        return new OrderDetailsResponse(
                order.getId(),
                order.getCustomer(),
                product,
                order.getQuantity(),
                order.getUnitPrice(),
                total
        );
    }
}