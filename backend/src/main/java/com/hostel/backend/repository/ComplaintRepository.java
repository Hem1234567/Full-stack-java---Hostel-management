package com.hostel.backend.repository;

import com.hostel.backend.entity.Complaint;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByStudentId(Long studentId);
    long countByStatus(String status);
    @EntityGraph(attributePaths = {"student"})
    List<Complaint> findTop5ByOrderByIdDesc();
}
