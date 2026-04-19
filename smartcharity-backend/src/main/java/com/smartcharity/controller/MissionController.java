package com.smartcharity.controller;
import com.smartcharity.model.Mission;
import com.smartcharity.repository.MissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.smartcharity.repository.NgoRepository;
import com.smartcharity.model.Ngo;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
@RestController
@RequestMapping("/api/missions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class MissionController {
    private final MissionRepository missionRepository;
    private final NgoRepository ngoRepository;
    @GetMapping
    public List<Mission> getActiveMissions() {
        return missionRepository.findAll();
    }
    @PostMapping
    public ResponseEntity<Mission> createMission(@RequestBody Mission mission) {
        mission.setCurrentAmount(0);
        mission.setJoinedUserIds(new ArrayList<>());
        mission.setPointBonus(50); 
        return ResponseEntity.ok(missionRepository.save(mission));
    }
    @PostMapping("/{id}/join")
    public ResponseEntity<Map<String, String>> joinMission(@PathVariable String id, @RequestParam String userId) {
        Mission mission = missionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mission not found"));
        if (!mission.getJoinedUserIds().contains(userId)) {
            mission.getJoinedUserIds().add(userId);
            missionRepository.save(mission);
        }
        return ResponseEntity.ok(Map.of("message", "Joined successfully!"));
    }
    @PostMapping("/{id}/fund")
    public ResponseEntity<Mission> fundMission(@PathVariable String id, @RequestBody Map<String, Double> payload) {
        Mission mission = missionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mission not found"));
        double amount = payload.getOrDefault("amount", 0.0);
        mission.setCurrentAmount(mission.getCurrentAmount() + amount);
        mission = missionRepository.save(mission);
        ngoRepository.findById(mission.getNgoId()).ifPresent(ngo -> {
            ngo.setTotalFundsReceived(ngo.getTotalFundsReceived() + amount);
            ngoRepository.save(ngo);
        });
        return ResponseEntity.ok(mission);
    }
}