package com.API.API.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_permissions")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class UserPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userPermissionID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userID", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "permissionID", nullable = false)
    private Permission permission;

    @Column(nullable = false, updatable = false)
    private LocalDateTime assignedAt = LocalDateTime.now(); // Default to the current timestamp

    // Getters and Setters
    public Integer getUserPermissionID() {
        return userPermissionID;
    }

    public void setUserPermissionID(Integer userPermissionID) {
        this.userPermissionID = userPermissionID;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Permission getPermission() {
        return permission;
    }

    public void setPermission(Permission permission) {
        this.permission = permission;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }
}
