package com.tim.ecommercemongodbpostgres.repository;

import com.tim.ecommercemongodbpostgres.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository
        extends JpaRepository<Customer, Long> {
}
