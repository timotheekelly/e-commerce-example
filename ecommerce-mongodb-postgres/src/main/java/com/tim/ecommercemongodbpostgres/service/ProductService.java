package com.tim.ecommercemongodbpostgres.service;

import com.tim.ecommercemongodbpostgres.model.Product;
import com.tim.ecommercemongodbpostgres.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product getProduct(String id) {
        return productRepository.findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException("Product not found: " + id));
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByIds(List<String> ids) {
        return productRepository.findAllById(ids);
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }
}