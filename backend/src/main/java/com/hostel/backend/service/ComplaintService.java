package com.hostel.backend.service;

import com.hostel.backend.entity.Complaint;
import com.hostel.backend.entity.User;
import com.hostel.backend.repository.ComplaintRepository;
import com.hostel.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public Complaint submitComplaint(Long studentId, String title, String description) {
        User student = userRepository.findById(studentId).orElseThrow();
        Complaint complaint = Complaint.builder()
                .title(title)
                .description(description)
                .status("PENDING")
                .student(student)
                .build();
        return complaintRepository.save(complaint);
    }

    public List<Complaint> getStudentComplaints(Long studentId) {
        return complaintRepository.findByStudentId(studentId);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public Complaint resolveComplaint(Long id) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow();
        complaint.setStatus("RESOLVED");
        return complaintRepository.save(complaint);
    }

    public void deleteComplaint(Long id) {
        complaintRepository.deleteById(id);
    }
}
