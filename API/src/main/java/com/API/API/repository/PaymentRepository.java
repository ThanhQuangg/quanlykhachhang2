package com.API.API.repository;

import com.API.API.model.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Page<Payment> findAll(Pageable pageable);

    @Query("SELECT p FROM Payment p WHERE " +
            "(:customerId IS NULL OR p.customer.customerId = :customerId) AND " +
            "(:projectId IS NULL OR p.project.projectId = :projectId) AND " +
            "(:installmentNumber IS NULL OR p.installmentNumber = :installmentNumber) AND " +
            "(:paymentStatus IS NULL OR p.paymentStatus = :paymentStatus) AND " +
            "(:paymentDate IS NULL OR p.paymentDate = :paymentDate) AND " +
            "(:amountMin IS NULL OR p.amount >= :amountMin) AND " +
            "(:amountMax IS NULL OR p.amount <= :amountMax)")
    List<Payment> searchPayments(
            @Param("customerId") Integer customerId,
            @Param("projectId") Integer projectId,
            @Param("installmentNumber") Integer installmentNumber,
            @Param("paymentStatus") Payment.PaymentStatus paymentStatus,
            @Param("paymentDate") LocalDate paymentDate,
            @Param("amountMin") BigDecimal amountMin,
            @Param("amountMax") BigDecimal amountMax
    );}
