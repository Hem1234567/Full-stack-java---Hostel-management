package com.hostel.backend.controller;

import com.hostel.backend.dto.AdminStatsDTO;
import com.hostel.backend.entity.Role;
import com.hostel.backend.repository.ComplaintRepository;
import com.hostel.backend.repository.FeeRepository;
import com.hostel.backend.repository.RoomRepository;
import com.hostel.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class StatsController {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final ComplaintRepository complaintRepository;
    private final FeeRepository feeRepository;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> getStats() {
        return ResponseEntity.ok(AdminStatsDTO.builder()
                .totalStudents(userRepository.countByRole(Role.STUDENT))
                .totalRooms(roomRepository.count())
                .openComplaints(complaintRepository.countByStatus("PENDING"))
                .feesPaid(feeRepository.countByPaid(true))
                .feesPending(feeRepository.countByPaid(false))
                .recentComplaints(complaintRepository.findTop5ByOrderByIdDesc())
                .recentStudents(userRepository.findTop5ByRoleOrderByIdDesc(Role.STUDENT))
                .build());
    }
}
