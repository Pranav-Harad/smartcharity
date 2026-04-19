package com.smartcharity.service;
import com.smartcharity.model.Donation;
import com.smartcharity.model.Ngo;
import com.smartcharity.model.User; 
import com.smartcharity.repository.DonationRepository;
import com.smartcharity.repository.NgoRepository;
import com.smartcharity.repository.UserRepository; 
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
    private final UserRepository userRepository; 
    private final GeminiService geminiService;
    private final RewardService rewardService; 
    public Donation processDonation(Donation donation) {
        User user = userRepository.findById(donation.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Ngo ngo = ngoRepository.findById(donation.getNgoId())
                .orElseThrow(() -> new RuntimeException("NGO not found"));
        donation.setTimestamp(LocalDateTime.now());
        donation.setStatus("SUCCESS");
        String hash = generateAuditHash(donation);
        donation.setAuditHash(hash);
        ngo.setTotalFundsReceived(ngo.getTotalFundsReceived() + donation.getAmount());
        ngoRepository.save(ngo);
        try {
            String story = geminiService.generateImpactStory(donation, ngo);
            donation.setImpactStory(story);
        } catch (Exception e) {
            donation.setImpactStory("Thank you for your contribution!");
        }
        rewardService.awardPoints(user, donation.getAmount(), donation.getCause());
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