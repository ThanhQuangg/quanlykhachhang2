package com.API.API.service;

import com.API.API.config.FileUtils;
import com.API.API.model.User;
import com.API.API.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Formatter;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import javax.management.relation.Role;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Hàm mã hóa mật khẩu bằng SHA-256
    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = digest.digest(password.getBytes(StandardCharsets.UTF_8));

            // Chuyển đổi byte[] thành chuỗi Hexadecimal
            try (Formatter formatter = new Formatter()) {
                for (byte b : hashedBytes) {
                    formatter.format("%02x", b);
                }
                return formatter.toString();
            }
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error while hashing password", e);
        }
    }

    // Xác thực đăng nhập
    public Optional<User> login(String username, String password) {
        // Mã hóa mật khẩu người dùng nhập vào
        String hashedPassword = hashPassword(password);

        // So sánh với mật khẩu đã mã hóa trong cơ sở dữ liệu
        return userRepository.findByUsernameAndPassword(username, hashedPassword);
    }

    public Page<User> searchByUsername(String username, Pageable pageable) {
        return userRepository.findByUsernameContaining(username, pageable);
    }

    public Page<User> searchByEmail(String email, Pageable pageable) {
        return userRepository.findByEmailContaining(email, pageable);
    }

    public Page<User> searchByFullName(String fullName, Pageable pageable) {
        return userRepository.findByFullNameContaining(fullName, pageable);
    }

    public Page<User> searchByRole(User.Role role, Pageable pageable) {
        return userRepository.findByRole(role, pageable);
    }

    public Page<User> searchUsers(String username, String email, User.Role role, String fullName, Pageable pageable) {
        return userRepository.searchUsers(username, email, role, fullName, pageable);
    }


    // Tạo người dùng mới (chỉ mã hóa khi lưu)
    public User createUser(User user) {
        // Mã hóa mật khẩu trước khi lưu vào database
        user.setPassword(hashPassword(user.getPassword()));
        return userRepository.save(user);
    }

    public User updateUser(Integer id, User updatedUser, MultipartFile file) throws IOException {
        return userRepository.findById(id)
                .map(user -> {
                    // Cập nhật thông tin cơ bản
                    user.setUsername(updatedUser.getUsername());
                    user.setFullName(updatedUser.getFullName());
                    user.setEmail(updatedUser.getEmail());
                    user.setRole(updatedUser.getRole());

                    // Kiểm tra nếu có file tải lên
                    if (file != null && !file.isEmpty()) {
                        try {
                            // Lưu avatar mới
                            String avatarUrl = FileUtils.saveAvatar(file);
                            user.setAvatar(avatarUrl); // Cập nhật avatar mới
                        } catch (IOException e) {
                            throw new RuntimeException("Error saving avatar", e);
                        }
                    } else {
                        // Nếu không có file tải lên, giữ nguyên avatar hiện tại
                        user.setAvatar(user.getAvatar());
                    }

                    return userRepository.save(user); // Lưu thông tin người dùng
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }



    // Hàm kiểm tra xem mật khẩu đã được mã hóa SHA-256 hay chưa
    private boolean isPasswordHashed(String password) {
        return password.matches("^[a-fA-F0-9]{64}$"); // SHA-256 luôn là chuỗi Hex dài 64 ký tự
    }

    // Xóa người dùng
    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    // Lấy tất cả người dùng
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Lấy người dùng theo ID
    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    public Page<User> getPaginatedUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size); // Tạo Pageable
        return userRepository.findAll(pageable);
    }
}
