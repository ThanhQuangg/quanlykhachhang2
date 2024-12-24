package com.API.API.repository;

import com.API.API.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Integer> {
    Page<Project> findAll(Pageable pageable);

    @Query("SELECT p FROM Project p WHERE " +
            "(:customerId IS NULL OR p.customer.customerId = :customerId) AND " +
            "(:userId IS NULL OR p.user.userId = :userId) AND " +
            "(:projectTypeId IS NULL OR p.projectType.projectTypeId = :projectTypeId) AND " +
            "(:projectName IS NULL OR p.projectName LIKE %:projectName%) AND " +
            "(:status IS NULL OR p.status = :status) AND " +
            "(:startDate IS NULL OR p.startDate >= :startDate) AND " +
            "(:endDate IS NULL OR p.endDate <= :endDate) AND " +
            "(:remainingAmount IS NULL OR p.totalAmount >= :remainingAmount) AND " +
            "(:paidAmount IS NULL OR p.totalAmount <= :paidAmount) AND " +
            "(:totalAmount IS NULL OR p.totalAmount = :totalAmount) AND " +
            "(:description IS NULL OR p.description LIKE %:description%)")
    List<Project> searchProjects(
            @Param("customerId") Integer customerId,
            @Param("userId") Integer userId,
            @Param("projectTypeId") Integer projectTypeId,
            @Param("projectName") String projectName,
            @Param("status") Project.Status status,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("remainingAmount") BigDecimal remainingAmount,
            @Param("paidAmount") BigDecimal paidAmount,
            @Param("totalAmount") BigDecimal totalAmount,
            @Param("description") String description
    );
}
