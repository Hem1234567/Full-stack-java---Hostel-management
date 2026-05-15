package com.hostel.backend.service;

import com.hostel.backend.entity.Room;
import com.hostel.backend.entity.RoomAllocation;
import com.hostel.backend.entity.User;
import com.hostel.backend.repository.RoomAllocationRepository;
import com.hostel.backend.repository.RoomRepository;
import com.hostel.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomAllocationRepository roomAllocationRepository;
    private final UserRepository userRepository;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    public Room updateRoom(Long id, Room updated) {
        Room room = roomRepository.findById(id).orElseThrow();
        room.setRoomNumber(updated.getRoomNumber());
        room.setCapacity(updated.getCapacity());
        room.setCurrentOccupancy(updated.getCurrentOccupancy());
        return roomRepository.save(room);
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }

    public RoomAllocation allocateRoom(Long studentId, Long roomId) {
        User student = userRepository.findById(studentId).orElseThrow();
        Room room = roomRepository.findById(roomId).orElseThrow();

        if (room.getCurrentOccupancy() >= room.getCapacity()) {
            throw new RuntimeException("Room is full");
        }

        room.setCurrentOccupancy(room.getCurrentOccupancy() + 1);
        roomRepository.save(room);

        RoomAllocation allocation = RoomAllocation.builder()
                .student(student)
                .room(room)
                .allocationDate(LocalDate.now().toString())
                .build();
        return roomAllocationRepository.save(allocation);
    }

    public RoomAllocation getStudentAllocation(Long studentId) {
        return roomAllocationRepository.findByStudentId(studentId)
                .orElse(null);
    }

    public List<RoomAllocation> getAllAllocations() {
        return roomAllocationRepository.findAll();
    }
}
