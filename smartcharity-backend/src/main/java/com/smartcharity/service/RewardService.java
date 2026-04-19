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
        int basePoints = (int) (amount / 10);
        int streakBonus = user.getCurrentStreak() * 5;
        int totalNewPoints = basePoints + streakBonus;
        user.setImpactPoints(user.getImpactPoints() + totalNewPoints);
        user.setCurrentStreak(user.getCurrentStreak() + 1);
        checkAndAwardBadges(user);
        userRepository.save(user);
    }
    private void checkAndAwardBadges(User user) {
        if (user.getEarnedBadges() == null) {
            user.setEarnedBadges(new ArrayList<>());
        }
        List<String> currentBadges = user.getEarnedBadges();
        if (!currentBadges.contains("FIRST_TIMER")) {
            currentBadges.add("FIRST_TIMER");
        }
        if (user.getImpactPoints() >= 100 && !currentBadges.contains("CENTURION")) {
            currentBadges.add("CENTURION");
        }
    }
}