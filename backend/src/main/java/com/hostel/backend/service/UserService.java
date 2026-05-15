package com.hostel.backend.service;

import com.hostel.backend.entity.User;
import com.hostel.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllStudents() {
        return userRepository.findByRole(com.hostel.backend.entity.Role.STUDENT);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User updateProfilePic(Long id, String profilePic) {
        User user = getUserById(id);
        user.setProfilePic(profilePic);
        return userRepository.save(user);
    }

    public User promoteToAdmin(Long id) {
        User user = getUserById(id);
        user.setRole(com.hostel.backend.entity.Role.ADMIN);
        return userRepository.save(user);
    }
}
