package com.API.API.service;

import com.API.API.model.Project;
import com.API.API.model.User;
import com.API.API.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<Project> getProjectById(Integer id) {
        return projectRepository.findById(id);
    }

    // Tạo mới dự án
    public Project createProject(Project project) {
        // Thiết lập ngày bắt đầu (startDate) là ngày hiện tại
        project.setStartDate(LocalDate.now());

        // Thiết lập thời gian tạo (createdAt)
        project.setCreatedAt(LocalDateTime.now());

        // Lưu dự án vào cơ sở dữ liệu và trả về
        return projectRepository.save(project);
    }

    public Project updateProject(Integer id, Project updatedProject) {
        return projectRepository.findById(id)
                .map(project -> {
                    // Chỉ cập nhật các trường khác, không thay đổi startDate
                    project.setCustomer(updatedProject.getCustomer());
                    project.setUser(updatedProject.getUser());
                    project.setProjectType(updatedProject.getProjectType());
                    project.setProjectName(updatedProject.getProjectName());
                    project.setDescription(updatedProject.getDescription());
                    // project.setStartDate(updatedProject.getStartDate()); // Không cập nhật startDate
                    project.setEndDate(updatedProject.getEndDate());
                    project.setStatus(updatedProject.getStatus());
                    project.setTotalAmount(updatedProject.getTotalAmount());
                    project.setPaidAmount(updatedProject.getPaidAmount());
                    return projectRepository.save(project);
                })
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }


    public void deleteProject(Integer id) {
        projectRepository.deleteById(id);
    }

    public Page<Project> getPaginatedProjects(int page, int size) {
        Pageable pageable = PageRequest.of(page, size); // Tạo Pageable
        return projectRepository.findAll(pageable);
    }

    public List<Project> searchProjects(Integer customerId, Integer userId, Integer projectTypeId,
                                        String projectName, Project.Status status, LocalDate startDate,
                                        LocalDate endDate, BigDecimal remainingAmount, BigDecimal paidAmount,
                                        BigDecimal totalAmount, String description) {
        return projectRepository.searchProjects(customerId, userId, projectTypeId, projectName,
                status, startDate, endDate, remainingAmount, paidAmount, totalAmount, description);
    }
}
