package com.hostel.backend.service;

import com.hostel.backend.entity.Fee;
import com.hostel.backend.entity.User;
import com.hostel.backend.repository.FeeRepository;
import com.hostel.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeeService {

    private final FeeRepository feeRepository;
    private final UserRepository userRepository;

    public List<Fee> getStudentFees(Long studentId) {
        return feeRepository.findByStudentId(studentId);
    }

    public List<Fee> getAllFees() {
        return feeRepository.findAll();
    }

    public Fee createFee(Long studentId, String month, double amount) {
        User student = userRepository.findById(studentId).orElseThrow();
        Fee fee = Fee.builder()
                .student(student)
                .month(month)
                .amount(amount)
                .paid(false)
                .build();
        return feeRepository.save(fee);
    }

    public Fee payFee(Long feeId) {
        Fee fee = feeRepository.findById(feeId).orElseThrow();
        fee.setPaid(true);
        fee.setPaymentDate(LocalDate.now().toString());
        return feeRepository.save(fee);
    }
}
