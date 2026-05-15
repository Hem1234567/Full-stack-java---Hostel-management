package com.hostel.backend.service;

import com.hostel.backend.dto.AuthRequest;
import com.hostel.backend.dto.AuthResponse;
import com.hostel.backend.entity.Role;
import com.hostel.backend.entity.User;
import com.hostel.backend.repository.UserRepository;
import com.hostel.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(AuthRequest request) {
        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN") ? Role.ADMIN : Role.STUDENT)
                .build();
        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .id(user.getId())
                .token(jwtToken)
                .role(user.getRole().name())
                .name(user.getName())
                .email(user.getEmail())
                .profilePic(user.getProfilePic())
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        var user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .id(user.getId())
                .token(jwtToken)
                .role(user.getRole().name())
                .name(user.getName())
                .email(user.getEmail())
                .profilePic(user.getProfilePic())
                .build();
    }
}
