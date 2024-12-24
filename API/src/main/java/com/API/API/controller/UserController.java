package com.API.API.controller;

import com.API.API.dto.LoginRequest;
import com.API.API.dto.LoginResponse;
import com.API.API.model.User;
import com.API.API.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.management.relation.Role;
import java.io.IOException;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // POST: /api/users/login
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> user = userService.login(loginRequest.getUsername(), loginRequest.getPassword());
        if (user.isPresent()) {
            User loggedInUser = user.get();
            return ResponseEntity.ok(new LoginResponse(
                    "Login successful!",
                    true,
                    loggedInUser.getUserId(),
                    loggedInUser.getUsername(),
                    loggedInUser.getRole().toString() // Trả về vai trò của người dùng
            ));
        } else {
            return ResponseEntity.status(401).body(new LoginResponse(
                    "Invalid username or password",
                    false,
                    null,
                    null,
                    null
            ));
        }
    }



    // GET: /api/users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // GET: /api/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<User>> getPaginatedUsers(
            @RequestParam(defaultValue = "0") int page,  // Trang mặc định là 0
            @RequestParam(defaultValue = "10") int size // Kích thước mặc định là 10
    ) {
        Page<User> paginatedUsers = userService.getPaginatedUsers(page, size);
        return ResponseEntity.ok(paginatedUsers);
    }


    @GetMapping("/search/username")
    public Page<User> searchByUsername(
            @RequestParam String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userService.searchByUsername(username, pageable);
    }

    @GetMapping("/search/email")
    public Page<User> searchByEmail(
            @RequestParam String email,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userService.searchByEmail(email, pageable);
    }

    @GetMapping("/search/fullName")
    public Page<User> searchByFullName(
            @RequestParam String fullName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userService.searchByFullName(fullName, pageable);
    }

    @GetMapping("/search/role")
    public Page<User> searchByRole(
            @RequestParam User.Role role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userService.searchByRole(role, pageable);
    }

    @GetMapping("/search")
    public Page<User> searchUsers(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) User.Role role,
            @RequestParam(required = false) String fullName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userService.searchUsers(username, email, role, fullName, pageable);
    }

    // POST: /api/users
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    // PUT: /api/users/{id}
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Integer id,
                                           @RequestParam(value = "file", required = false) MultipartFile file,
                                           @RequestParam("username") String username,
                                            @RequestParam("fullName") String fullName,
                                           @RequestParam("email") String email,
                                           @RequestParam("role") String role) {
        try {
            User updatedUser = new User();
            updatedUser.setUsername(username);
            updatedUser.setFullName(fullName);
            updatedUser.setEmail(email);
            updatedUser.setRole(User.Role.valueOf(role));


            User savedUser = userService.updateUser(id, updatedUser, file);
            return ResponseEntity.ok(savedUser);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // DELETE: /api/users/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}