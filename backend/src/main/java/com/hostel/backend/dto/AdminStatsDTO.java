package com.hostel.backend.dto;

import com.hostel.backend.entity.Complaint;
import com.hostel.backend.entity.User;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AdminStatsDTO {
    private long totalStudents;
    private long totalRooms;
    private long openComplaints;
    private long feesPaid;
    private long feesPending;
    private List<Complaint> recentComplaints;
    private List<User> recentStudents;
}
