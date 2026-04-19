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
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserStats(@PathVariable String id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/leaderboard")
    public List<User> getLeaderboard() {
        return userRepository.findTop10ByRoleOrderByImpactPointsDesc("USER");
    }
}