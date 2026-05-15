package com.hostel.backend.controller;

import com.hostel.backend.entity.Fee;
import com.hostel.backend.service.FeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FeeController {

    private final FeeService feeService;

    @GetMapping("/fees/student/{studentId}")
    public ResponseEntity<List<Fee>> getStudentFees(@PathVariable Long studentId) {
        return ResponseEntity.ok(feeService.getStudentFees(studentId));
    }

    @GetMapping("/admin/fees")
    public ResponseEntity<List<Fee>> getAllFees() {
        return ResponseEntity.ok(feeService.getAllFees());
    }

    @PostMapping("/admin/fees")
    public ResponseEntity<Fee> createFee(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(feeService.createFee(
                Long.parseLong(body.get("studentId")),
                body.get("month"),
                Double.parseDouble(body.get("amount"))));
    }

    @PutMapping("/fees/{feeId}/pay")
    public ResponseEntity<Fee> payFee(@PathVariable Long feeId) {
        return ResponseEntity.ok(feeService.payFee(feeId));
    }
}
