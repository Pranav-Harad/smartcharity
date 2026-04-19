package com.smartcharity.controller;
import com.smartcharity.model.Donation;
import com.smartcharity.repository.DonationRepository;
import com.smartcharity.service.DonationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DonationController {
    private final DonationService donationService;
    private final DonationRepository donationRepository;
    private final com.smartcharity.repository.UserRepository userRepository;
    @PostMapping
    public ResponseEntity<Donation> createDonation(@RequestBody Donation donation) {
        return ResponseEntity.ok(donationService.processDonation(donation));
    }
    @GetMapping("/history")
    public ResponseEntity<List<Donation>> getDonationHistory(@RequestParam String userId) {
        return ResponseEntity.ok(donationRepository.findByUserId(userId));
    }
    @GetMapping("/ngo/{ngoId}/supporters")
    public ResponseEntity<List<java.util.Map<String, Object>>> getNgoSupporters(@PathVariable String ngoId) {
        List<Donation> donations = donationRepository.findByNgoId(ngoId);
        List<java.util.Map<String, Object>> supporters = new java.util.ArrayList<>();
        for (Donation d : donations) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", d.getId());
            map.put("amount", d.getAmount());
            map.put("timestamp", d.getTimestamp());
            map.put("missionId", d.getCause()); 
            String donorName = "Anonymous Donor";
            if (d.getUserId() != null) {
                donorName = userRepository.findById(d.getUserId())
                        .map(com.smartcharity.model.User::getName)
                        .orElse("Anonymous Donor");
            }
            map.put("donorName", donorName);
            map.put("userId", d.getUserId());
            supporters.add(map);
        }
        return ResponseEntity.ok(supporters);
    }
}