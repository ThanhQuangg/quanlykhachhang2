package com.API.API.repository;

import com.API.API.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    List<Customer> findByCustomerIdNotIn(List<Integer> customerIds);
    Page<Customer> findAll(Pageable pageable);

    @Query("SELECT c FROM Customer c WHERE " +
            "(:name IS NULL OR c.name LIKE %:name%) AND " +
            "(:email IS NULL OR c.email LIKE %:email%) AND " +
            "(:phone IS NULL OR c.phone LIKE %:phone%) AND " +
            "(:gender IS NULL OR c.gender = :gender) AND " +
            "(:classificationId IS NULL OR c.classification.classificationId = :classificationId)")
    List<Customer> searchCustomers(
            @Param("name") String name,
            @Param("email") String email,
            @Param("phone") String phone,
            @Param("gender") Customer.Gender gender,
            @Param("classificationId") Integer classificationId

    );
}
