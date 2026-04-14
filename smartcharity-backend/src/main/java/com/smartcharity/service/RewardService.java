package com.smartcharity.service;

import com.smartcharity.model.User;
import com.smartcharity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RewardService {

    private final UserRepository userRepository;

    public void awardPoints(User user, double amount, String cause) {
        // 1. Base points calculation: amount / 10
        int basePoints = (int) (amount / 10);

        // 2. Streak bonus: current streak * 5 points
        int streakBonus = user.getCurrentStreak() * 5;

        // 3. Update total impact points
        int totalNewPoints = basePoints + streakBonus;
        user.setImpactPoints(user.getImpactPoints() + totalNewPoints);

        // 4. Update streaks (Simplified: increments on every donation for dev)
        user.setCurrentStreak(user.getCurrentStreak() + 1);

        // 5. Check and award badges
        checkAndAwardBadges(user);

        // 6. Save updated user to MongoDB
        userRepository.save(user);
    }

    private void checkAndAwardBadges(User user) {
        if (user.getEarnedBadges() == null) {
            user.setEarnedBadges(new ArrayList<>());
        }

        List<String> currentBadges = user.getEarnedBadges();

        // First Timer Badge [cite: 151]
        if (!currentBadges.contains("FIRST_TIMER")) {
            currentBadges.add("FIRST_TIMER");
        }

        // Centurion Badge (Reaching 100 points)
        if (user.getImpactPoints() >= 100 && !currentBadges.contains("CENTURION")) {
            currentBadges.add("CENTURION");
        }
    }
}