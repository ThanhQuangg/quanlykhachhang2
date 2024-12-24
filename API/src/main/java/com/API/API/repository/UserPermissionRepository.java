package com.API.API.repository;

import com.API.API.model.Permission;
import com.API.API.model.User;
import com.API.API.model.UserPermission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPermissionRepository extends JpaRepository<UserPermission, Integer> {
    Optional<UserPermission> findByUserAndPermission(User user, Permission permission);
    // Kiểm tra quyền đã được gán cho user
    boolean existsByUserAndPermission(User user, Permission permission);

    Page<UserPermission> findAll(Pageable pageable);
}
