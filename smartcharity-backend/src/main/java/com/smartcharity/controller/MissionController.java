package com.smartcharity.controller;

import com.smartcharity.model.Mission;
import com.smartcharity.repository.MissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/missions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class MissionController {

    private final MissionRepository missionRepository;

    @GetMapping
    public List<Mission> getActiveMissions() {
        return missionRepository.findAll();
    }

    // POST /api/missions - NGO Admin creates a mission
    @PostMapping
    public ResponseEntity<Mission> createMission(@RequestBody Mission mission) {
        mission.setCurrentAmount(0);
        mission.setJoinedUserIds(new ArrayList<>());
        mission.setPointBonus(50); // Standard bonus for micro-missions [cite: 156]
        return ResponseEntity.ok(missionRepository.save(mission));
    }

    // POST /api/missions/{id}/join - User joins a mission
    @PostMapping("/{id}/join")
    public ResponseEntity<Map<String, String>> joinMission(@PathVariable String id, @RequestParam String userId) {
        Mission mission = missionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mission not found"));

        if (!mission.getJoinedUserIds().contains(userId)) {
            mission.getJoinedUserIds().add(userId);
            missionRepository.save(mission);
        }

        // Return JSON instead of a plain string to fix the "Unexpected token J" error
        return ResponseEntity.ok(Map.of("message", "Joined successfully!"));
    }
}