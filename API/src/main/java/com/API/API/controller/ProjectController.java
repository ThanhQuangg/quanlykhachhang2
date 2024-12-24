package com.API.API.controller;

import com.API.API.model.Project;
import com.API.API.model.User;
import com.API.API.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    // GET: /api/projects
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        List<Project> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Integer id) {
        Optional<Project> project = projectService.getProjectById(id);
        return project.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<Project>> getPaginatedProjects(
            @RequestParam(defaultValue = "0") int page,  // Trang mặc định là 0
            @RequestParam(defaultValue = "10") int size // Kích thước mặc định là 10
    ) {
        Page<Project> paginatedProjects = projectService.getPaginatedProjects(page, size);
        return ResponseEntity.ok(paginatedProjects);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Project>> searchProjects(
            @RequestParam(required = false) Integer customerId,
            @RequestParam(required = false) Integer userId,
            @RequestParam(required = false) Integer projectTypeId,
            @RequestParam(required = false) String projectName,
            @RequestParam(required = false) Project.Status status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) BigDecimal remainingAmount,
            @RequestParam(required = false) BigDecimal paidAmount,
            @RequestParam(required = false) BigDecimal totalAmount,
            @RequestParam(required = false) String description
    ) {
        List<Project> projects = projectService.searchProjects(customerId, userId, projectTypeId,
                projectName, status, startDate, endDate, remainingAmount, paidAmount, totalAmount, description);
        return ResponseEntity.ok(projects);
    }

    // POST: /api/projects
    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        try {
            // Gọi service để tạo dự án
            Project savedProject = projectService.createProject(project);
            return ResponseEntity.ok(savedProject);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }



    // PUT: /api/projects/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Integer id, @RequestBody Project project) {
        try {
            Project updatedProject = projectService.updateProject(id, project);
            return ResponseEntity.ok(updatedProject);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE: /api/projects/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Integer id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
