package com.smartcharity.service;

import com.smartcharity.model.Donation;
import com.smartcharity.model.Ngo;
import com.smartcharity.model.User; // Fixes 'Cannot resolve symbol User'
import com.smartcharity.repository.DonationRepository;
import com.smartcharity.repository.NgoRepository;
import com.smartcharity.repository.UserRepository; // Added this
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository donationRepository;
    private final NgoRepository ngoRepository;
    private final UserRepository userRepository; // Added to find the 'user'
    private final GeminiService geminiService;
    private final RewardService rewardService; // Aligned with documentation

    public Donation processDonation(Donation donation) {
        // 1. Validate user and NGO exist
        User user = userRepository.findById(donation.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ngo ngo = ngoRepository.findById(donation.getNgoId())
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        // 2. Set donation details [cite: 125, 130]
        donation.setTimestamp(LocalDateTime.now());
        donation.setStatus("SUCCESS");

        // 3. Generate SHA-256 audit hash [cite: 129, 200]
        String hash = generateAuditHash(donation);
        donation.setAuditHash(hash);

        // 4. Update NGO's total funds [cite: 133]
        ngo.setTotalFundsReceived(ngo.getTotalFundsReceived() + donation.getAmount());
        ngoRepository.save(ngo);

        // 5. AI Integration: Generate Impact Story [cite: 132, 140]
        try {
            String story = geminiService.generateImpactStory(donation, ngo);
            donation.setImpactStory(story);
        } catch (Exception e) {
            donation.setImpactStory("Thank you for your contribution!");
        }

        // 6. Award Points and Badges (Reward System) [cite: 134, 150]
        rewardService.awardPoints(user, donation.getAmount(), donation.getCause());

        // 7. Save and return [cite: 131]
        return donationRepository.save(donation);
    }

    private String generateAuditHash(Donation d) {
        try {
            String rawData = d.getUserId() + d.getNgoId() + d.getAmount() + d.getTimestamp();
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(rawData.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encodedHash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating audit hash", e);
        }
    }
}