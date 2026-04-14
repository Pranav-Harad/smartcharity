package com.smartcharity.controller;

import com.smartcharity.model.User;
import com.smartcharity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    /**
     * Fetch profile for Dashboard/Passport.
     * Maps to: GET /api/users/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserStats(@PathVariable String id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Fetch Top 10 Donors for Leaderboard.
     * Maps to: GET /api/users/leaderboard
     * Fixes the 404 error by explicitly naming the path.
     */
    @GetMapping("/leaderboard")
    public List<User> getLeaderboard() {
        // Only fetch users with role 'USER' (Donors)
        return userRepository.findTop10ByRoleOrderByImpactPointsDesc("USER");
    }
}