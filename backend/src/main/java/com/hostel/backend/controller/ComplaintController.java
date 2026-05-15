package com.hostel.backend.controller;

import com.hostel.backend.entity.Complaint;
import com.hostel.backend.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping("/complaints")
    public ResponseEntity<Complaint> submit(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(complaintService.submitComplaint(
                Long.parseLong(body.get("studentId")),
                body.get("title"),
                body.get("description")));
    }

    @GetMapping("/complaints/student/{studentId}")
    public ResponseEntity<List<Complaint>> getStudentComplaints(@PathVariable Long studentId) {
        return ResponseEntity.ok(complaintService.getStudentComplaints(studentId));
    }

    @GetMapping("/admin/complaints")
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @PutMapping("/admin/complaints/{id}/resolve")
    public ResponseEntity<Complaint> resolve(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.resolveComplaint(id));
    }

    @DeleteMapping("/admin/complaints/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.ok().build();
    }
}
