package com.API.API.controller;

import com.API.API.dto.CustomerRequest;
import com.API.API.model.Customer;
import com.API.API.model.CustomerClassification;
import com.API.API.model.User;
import com.API.API.service.CustomerService;
import com.API.API.repository.CustomerClassificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerClassificationRepository classificationRepository;

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }





    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Integer id) {
        Optional<Customer> customer = customerService.getCustomerById(id);
        return customer.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<Customer>> getPaginationCustomers(
            @RequestParam(defaultValue = "0") int page,  // Trang mặc định là 0
            @RequestParam(defaultValue = "10") int size // Kích thước mặc định là 10
    ) {
        Page<Customer> paginatedCustomers = customerService.getPaginatedCustomers(page, size);
        return ResponseEntity.ok(paginatedCustomers);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Customer>> searchCustomers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) Customer.Gender gender,
            @RequestParam(required = false) Integer classificationId
    ) {
        List<Customer> customers = customerService.searchCustomers(name, email, phone, gender, classificationId);
        return ResponseEntity.ok(customers);
    }

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody CustomerRequest customerRequest) {
        Customer customer = new Customer();
        customer.setName(customerRequest.getName());
        customer.setEmail(customerRequest.getEmail());
        customer.setPhone(customerRequest.getPhone());
        customer.setAddress(customerRequest.getAddress());
        customer.setDateOfBirth(customerRequest.getDateOfBirth());

        if (customerRequest.getClassificationId() != null) {
            CustomerClassification classification = classificationRepository
                    .findById(customerRequest.getClassificationId())
                    .orElseThrow(() -> new RuntimeException("Classification not found"));
            customer.setClassification(classification);
        }

        Customer savedCustomer = customerService.createCustomer(customer);
        return ResponseEntity.ok(savedCustomer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Integer id, @RequestBody CustomerRequest customerRequest) {
        return customerService.getCustomerById(id)
                .map(existingCustomer -> {
                    // Update fields
                    existingCustomer.setName(customerRequest.getName());
                    existingCustomer.setEmail(customerRequest.getEmail());
                    existingCustomer.setPhone(customerRequest.getPhone());
                    existingCustomer.setAddress(customerRequest.getAddress());
                    existingCustomer.setDateOfBirth(customerRequest.getDateOfBirth());

                    if (customerRequest.getClassificationId() != null) {
                        CustomerClassification classification = classificationRepository
                                .findById(customerRequest.getClassificationId())
                                .orElseThrow(() -> new RuntimeException("Classification not found"));
                        existingCustomer.setClassification(classification);
                    }

                    Customer updatedCustomer = customerService.createCustomer(existingCustomer);
                    return ResponseEntity.ok(updatedCustomer);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Integer id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}
