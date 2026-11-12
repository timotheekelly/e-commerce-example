package com.tim.ecommercemongodbpostgres.service;

import com.tim.ecommercemongodbpostgres.model.Customer;
import com.tim.ecommercemongodbpostgres.repository.CustomerRepository;
import com.tim.ecommercemongodbpostgres.repository.OrderRepository;
import com.tim.ecommercemongodbpostgres.model.Order;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;

    public CustomerService(CustomerRepository customerRepository,
                           OrderRepository orderRepository) {
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
    }

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomer(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException("Customer not found: " + id));
    }

    public List<Order> getCustomerOrders(Long customerId) {
        getCustomer(customerId);
        return orderRepository.findByCustomer_Id(customerId);
    }
}