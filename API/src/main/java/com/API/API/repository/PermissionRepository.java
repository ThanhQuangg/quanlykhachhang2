package com.API.API.repository;

import com.API.API.model.Permission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Integer> {

    @Query("SELECT p FROM Permission p JOIN UserPermission up ON p.permissionID = up.permission.permissionID WHERE up.user.userId = :userId")
    List<Permission> findPermissionsByUserId(@Param("userId") Integer userId);

    Page<Permission> findAll(Pageable pageable);
}
