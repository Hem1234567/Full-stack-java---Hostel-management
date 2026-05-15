package com.hostel.backend.service;

import com.hostel.backend.entity.Attendance;
import com.hostel.backend.entity.User;
import com.hostel.backend.repository.AttendanceRepository;
import com.hostel.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    public Attendance markAttendance(Long studentId, String status) {
        User student = userRepository.findById(studentId).orElseThrow();
        Attendance attendance = Attendance.builder()
                .student(student)
                .date(LocalDate.now().toString())
                .status(status)
                .build();
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getStudentAttendance(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }
}
