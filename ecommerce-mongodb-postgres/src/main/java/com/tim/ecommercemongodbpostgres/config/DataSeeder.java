package com.tim.ecommercemongodbpostgres.config;

import com.tim.ecommercemongodbpostgres.model.Customer;
import com.tim.ecommercemongodbpostgres.model.Order;
import com.tim.ecommercemongodbpostgres.model.Product;
import com.tim.ecommercemongodbpostgres.repository.CustomerRepository;
import com.tim.ecommercemongodbpostgres.repository.OrderRepository;
import com.tim.ecommercemongodbpostgres.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Wipes both databases on every startup and loads demo data.
 *
 * PostgreSQL holds the uniform, relational data (customers, orders): fixed columns, foreign keys.
 * MongoDB holds the products: every category has completely different attributes, with
 * nested objects and arrays, and no schema migration is needed to store any of them.
 *
 * NOTE: destructive by design (demo project). Remove this class before using real data.
 */
@Component
public class DataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final JdbcTemplate jdbc;

    public DataSeeder(ProductRepository productRepository,
                      CustomerRepository customerRepository,
                      OrderRepository orderRepository,
                      JdbcTemplate jdbc) {
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
        this.jdbc = jdbc;
    }

    @Override
    public void run(ApplicationArguments args) {
        clear();
        List<Product> products = seedProducts();
        List<Customer> customers = seedCustomers();
        seedOrders(customers, products);
        log.info("Seeded {} products (MongoDB), {} customers and {} orders (PostgreSQL)",
                products.size(), customers.size(), orderRepository.count());
    }

    private void clear() {
        productRepository.deleteAll();
        // RESTART IDENTITY so customer/order ids start at 1 on every run
        jdbc.execute("TRUNCATE TABLE orders, customers RESTART IDENTITY CASCADE");
    }

    // ---------- MongoDB: same collection, very different shapes ----------

    private List<Product> seedProducts() {
        return productRepository.saveAll(List.of(
                product("Trail Runner X", "footwear", "129.99",
                        "brand", "Altura", "sizes_us", List.of(7, 8, 9, 10, 11), "colors", List.of("black", "lime"),
                        "waterproof", true, "weight_g", 280),
                product("Everyday Leather Boot", "footwear", "189.00",
                        "brand", "Harlow", "sizes_us", List.of(8, 9, 10), "material", "full-grain leather",
                        "resoleable", true),

                product("Aero 14 Laptop", "electronics", "1499.00",
                        "cpu", "8-core", "ram_gb", 32, "storage", Map.of("type", "NVMe SSD", "capacity_gb", 1024),
                        "display", Map.of("size_in", 14, "resolution", "2880x1800", "oled", true),
                        "ports", List.of("USB-C", "USB-C", "HDMI", "3.5mm")),
                product("Quiet Pro Headphones", "electronics", "299.50",
                        "battery_hours", 40, "noise_cancelling", true,
                        "connectivity", List.of("Bluetooth 5.3", "3.5mm"), "colors", List.of("graphite", "sand")),

                product("The Pragmatic Database", "books", "42.00",
                        "author", "J. Rivera", "isbn", "978-1-23456-789-0", "pages", 412,
                        "formats", List.of("hardcover", "ebook"), "language", "en"),
                product("Night Trains of Europe", "books", "24.95",
                        "author", "M. Okafor", "pages", 288, "illustrated", true, "language", "en",
                        "awards", List.of("Travel Writing Prize 2024")),

                product("Highland Single-Origin Coffee", "grocery", "16.50",
                        "origin", Map.of("country", "Ethiopia", "region", "Guji"), "roast", "light",
                        "weight_g", 340, "organic", true, "tasting_notes", List.of("blueberry", "jasmine", "honey")),
                product("Sea Salt Dark Chocolate", "grocery", "5.25",
                        "cocoa_percent", 72, "vegan", true, "allergens", List.of("soy"), "weight_g", 100),

                product("Merino Crew Tee", "apparel", "68.00",
                        "sizes", List.of("S", "M", "L", "XL"), "material", Map.of("merino_wool", 100),
                        "care", List.of("machine wash cold", "line dry"), "fit", "regular"),
                product("Monthly Coffee Subscription", "services", "29.00",
                        "billing_cycle", "monthly", "cancel_anytime", true, "trial_days", 14,
                        "includes", List.of("free shipping", "member pricing"))
        ));
    }

    private Product product(String name, String category, String price, Object... attrs) {
        Map<String, Object> attributes = new LinkedHashMap<>();
        for (int i = 0; i < attrs.length; i += 2) {
            attributes.put((String) attrs[i], attrs[i + 1]);
        }
        Product p = new Product();
        p.setName(name);
        p.setCategory(category);
        p.setPrice(new BigDecimal(price));
        p.setAttributes(attributes);
        return p;
    }

    // ---------- PostgreSQL: uniform rows with a foreign key ----------

    private List<Customer> seedCustomers() {
        return customerRepository.saveAll(List.of(
                customer("Ada Lovelace", "ada@example.com"),
                customer("Grace Hopper", "grace@example.com"),
                customer("Alan Turing", "alan@example.com"),
                customer("Katherine Johnson", "katherine@example.com"),
                customer("Linus Torvalds", "linus@example.com")
        ));
    }

    private Customer customer(String name, String email) {
        Customer c = new Customer();
        c.setName(name);
        c.setEmail(email);
        return c;
    }

    private void seedOrders(List<Customer> customers, List<Product> products) {
        // {customer index, product index, quantity}
        int[][] plan = {
                {0, 2, 1}, {0, 3, 1}, {0, 4, 2},
                {1, 0, 1}, {1, 6, 3},
                {2, 4, 1}, {2, 2, 1},
                {3, 8, 2}, {3, 9, 1}, {3, 5, 1},
                {4, 1, 1}, {4, 7, 4}
        };
        for (int[] row : plan) {
            Product product = products.get(row[1]);
            Order order = new Order();
            order.setCustomer(customers.get(row[0]));
            order.setProductId(product.getId());
            order.setQuantity(row[2]);
            order.setUnitPrice(product.getPrice());
            orderRepository.save(order);
        }
    }
}
