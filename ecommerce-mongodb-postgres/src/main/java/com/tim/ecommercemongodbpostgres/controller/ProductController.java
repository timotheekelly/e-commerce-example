package com.tim.ecommercemongodbpostgres.controller;

import com.tim.ecommercemongodbpostgres.model.Product;
import com.tim.ecommercemongodbpostgres.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(
            @RequestBody Product product) {

        Product created = productService.createProduct(product);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable String id) {

        Product product = productService.getProduct(id);

        return ResponseEntity.ok(product);
    }

    @GetMapping
    public ResponseEntity<List<Product>> getProductsByCategory(
            @RequestParam(required = false) String category) {

        List<Product> products = (category == null || category.isBlank())
                ? productService.getAllProducts()
                : productService.getProductsByCategory(category);

        return ResponseEntity.ok(products);
    }
}