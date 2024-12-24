package com.API.API.service;

import com.API.API.model.Permission;
import com.API.API.repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PermissionService {

    @Autowired
    private PermissionRepository permissionRepository;

    public List<Permission> getAllPermissions() {
        return permissionRepository.findAll();
    }

    public List<Permission> getPermissionsByUserId(Integer userId) {
        return permissionRepository.findPermissionsByUserId(userId);
    }

    public Page<Permission> getPaginatedPermissions(int page, int size) {
        Pageable pageable = PageRequest.of(page, size); // Tạo Pageable
        return permissionRepository.findAll(pageable);
    }
}
