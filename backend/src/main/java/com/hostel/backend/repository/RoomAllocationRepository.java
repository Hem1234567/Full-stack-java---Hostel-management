package com.hostel.backend.repository;

import com.hostel.backend.entity.RoomAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoomAllocationRepository extends JpaRepository<RoomAllocation, Long> {
    Optional<RoomAllocation> findByStudentId(Long studentId);
}
