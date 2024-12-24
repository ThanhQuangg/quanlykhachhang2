package com.API.API.repository;

import com.API.API.model.ProjectType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectTypeRepository extends JpaRepository<ProjectType, Integer> {
    Page<ProjectType> findAll(Pageable pageable);
}
