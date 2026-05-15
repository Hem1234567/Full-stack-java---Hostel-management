package com.hostel.backend.repository;

import com.hostel.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import com.hostel.backend.entity.Role;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);
    long countByRole(Role role);
    List<User> findTop5ByRoleOrderByIdDesc(Role role);
}
