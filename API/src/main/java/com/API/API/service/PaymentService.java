package com.API.API.service;

import com.API.API.model.Payment;
import com.API.API.model.User;
import com.API.API.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> getPaymentById(Integer id) {
        return paymentRepository.findById(id);
    }

    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    public Payment updatePaymentStatus(Integer id, String paymentStatus) {
        return paymentRepository.findById(id)
                .map(payment -> {
                    try {
                        Payment.PaymentStatus status = Payment.PaymentStatus.valueOf(paymentStatus);
                        payment.setPaymentStatus(status);
                    } catch (IllegalArgumentException e) {
                        throw new RuntimeException("Invalid payment status: " + paymentStatus);
                    }
                    return paymentRepository.save(payment);
                })
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + id));
    }


    public void deletePayment(Integer id) {
        paymentRepository.deleteById(id);
    }

    public Page<Payment> getPaginatedPayments(int page, int size) {
        Pageable pageable = PageRequest.of(page, size); // Tạo Pageable
        return paymentRepository.findAll(pageable);
    }

    public List<Payment> searchPayments(Integer customerId, Integer projectId, Integer installmentNumber,
                                        Payment.PaymentStatus paymentStatus, LocalDate paymentDate,
                                        BigDecimal amountMin, BigDecimal amountMax) {
        return paymentRepository.searchPayments(customerId, projectId, installmentNumber,
                paymentStatus, paymentDate, amountMin, amountMax);
    }
}
