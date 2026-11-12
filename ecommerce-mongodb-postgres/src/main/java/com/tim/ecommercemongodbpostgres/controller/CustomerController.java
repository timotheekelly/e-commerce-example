package com.tim.ecommercemongodbpostgres.controller;

import com.tim.ecommercemongodbpostgres.model.Customer;
import com.tim.ecommercemongodbpostgres.model.Order;
import com.tim.ecommercemongodbpostgres.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    public Customer createCustomer(@RequestBody Customer customer) {
        return customerService.createCustomer(customer);
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomer(@PathVariable Long id) {
        Customer customer = customerService.getCustomer(id);
        return ResponseEntity.ok(customer);
    }

    @GetMapping("/{id}/orders")
    public ResponseEntity<List<Order>> getCustomerOrders(@PathVariable Long id) {
        List<Order> customerOrders = customerService.getCustomerOrders(id);
        return ResponseEntity.ok(customerOrders);
    }
}