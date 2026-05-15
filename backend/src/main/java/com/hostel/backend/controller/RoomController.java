package com.hostel.backend.controller;

import com.hostel.backend.entity.Room;
import com.hostel.backend.entity.RoomAllocation;
import com.hostel.backend.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping("/rooms")
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @PostMapping("/admin/rooms")
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        return ResponseEntity.ok(roomService.createRoom(room));
    }

    @PutMapping("/admin/rooms/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room room) {
        return ResponseEntity.ok(roomService.updateRoom(id, room));
    }

    @DeleteMapping("/admin/rooms/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/admin/rooms/allocate")
    public ResponseEntity<RoomAllocation> allocateRoom(@RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(roomService.allocateRoom(body.get("studentId"), body.get("roomId")));
    }

    @GetMapping("/rooms/allocation/{studentId}")
    public ResponseEntity<RoomAllocation> getStudentAllocation(@PathVariable Long studentId) {
        return ResponseEntity.ok(roomService.getStudentAllocation(studentId));
    }

    @GetMapping("/admin/rooms/allocations")
    public ResponseEntity<List<RoomAllocation>> getAllAllocations() {
        return ResponseEntity.ok(roomService.getAllAllocations());
    }
}
