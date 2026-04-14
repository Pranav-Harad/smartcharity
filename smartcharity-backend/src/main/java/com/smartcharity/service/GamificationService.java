package com.smartcharity.service;

import com.smartcharity.model.User;
import com.smartcharity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class GamificationService {
    private final UserRepository userRepository;

    public void awardPointsAndCheckStreaks(String userId, double amount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Award Points (1 point per 10 INR)
        int pointsToAdd = (int) (amount / 10);
        user.setImpactPoints(user.getImpactPoints() + pointsToAdd);

        // 2. Update Streaks
        LocalDateTime now = LocalDateTime.now();
        if (user.getLastDonationDate() != null) {
            long daysSinceLast = ChronoUnit.DAYS.between(user.getLastDonationDate(), now);

            if (daysSinceLast == 1) {
                user.setCurrentStreak(user.getCurrentStreak() + 1);
            } else if (daysSinceLast > 1) {
                user.setCurrentStreak(1); // Reset if missed a day
            }
        } else {
            user.setCurrentStreak(1); // First donation ever
        }

        user.setLastDonationDate(now);

        // 3. Simple Badge Logic
        if (user.getImpactPoints() >= 100 && !user.getEarnedBadges().contains("CENTURION")) {
            user.getEarnedBadges().add("CENTURION");
        }

        userRepository.save(user);
    }

}
