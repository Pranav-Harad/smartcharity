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

    // POST /api/donations - Process a new donation
    @PostMapping
    public ResponseEntity<Donation> createDonation(@RequestBody Donation donation) {
        // In a real app, userId would be extracted from the JWT token
        return ResponseEntity.ok(donationService.processDonation(donation));
    }

    // GET /api/donations/history - Get all donations for a specific user
    @GetMapping("/history")
    public ResponseEntity<List<Donation>> getDonationHistory(@RequestParam String userId) {
        return ResponseEntity.ok(donationRepository.findByUserId(userId));
    }
}