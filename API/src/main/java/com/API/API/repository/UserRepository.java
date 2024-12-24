package com.API.API.repository;

import com.API.API.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import javax.management.relation.Role;
import java.util.List;
import java.util.Optional;

//public interface UserRepository extends JpaRepository<User, Integer> {
//
//    Optional<User> findByUsernameAndPassword(String username, String password); // Kiểm tra mật khẩu đã băm
//
//    Page<User> findAll(Pageable pageable);
//
//    List<User> findByUsernameContaining(String username); // Tìm kiếm username theo từ khóa
//    List<User> findByEmailContaining(String email); // Tìm kiếm email theo từ khóa
//    List<User> findByFullNameContaining(String fullName); // Tìm kiếm fullName theo từ khóa
//    List<User> findByRole(User.Role role); // Tìm kiếm theo vai trò
//
//    @Query("SELECT u FROM User u WHERE " +
//            "(:username IS NULL OR u.username LIKE %:username%) AND " +
//            "(:email IS NULL OR u.email LIKE %:email%) AND " +
//            "(:role IS NULL OR u.role = :role) AND " +
//            "(:fullName IS NULL OR u.fullName LIKE %:fullName%)")
//    List<User> searchUsers(
//            @Param("username") String username,
//            @Param("email") String email,
//            @Param("role") User.Role role,
//            @Param("fullName") String fullName
//    );
//}
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByUsernameAndPassword(String username, String password);

    Page<User> findAll(Pageable pageable);

    Page<User> findByUsernameContaining(String username, Pageable pageable);

    Page<User> findByEmailContaining(String email, Pageable pageable);

    Page<User> findByFullNameContaining(String fullName, Pageable pageable);

    Page<User> findByRole(User.Role role, Pageable pageable);

    @Query("SELECT u FROM User u WHERE " +
            "(:username IS NULL OR u.username LIKE %:username%) AND " +
            "(:email IS NULL OR u.email LIKE %:email%) AND " +
            "(:role IS NULL OR u.role = :role) AND " +
            "(:fullName IS NULL OR u.fullName LIKE %:fullName%)")
    Page<User> searchUsers(
            @Param("username") String username,
            @Param("email") String email,
            @Param("role") User.Role role,
            @Param("fullName") String fullName,
            Pageable pageable
    );
}
