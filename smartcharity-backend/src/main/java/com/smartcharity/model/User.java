package com.smartcharity.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String id;
    private String name;

    @Indexed(unique = true)
    private String email;

    private String passwordHash;
    private String role; // USER or NGO_ADMIN [cite: 98]

    // We will define these sub-classes in detail later
    // private DonationDna donationDna;
    // private StreakData streakData;
    private int impactPoints = 0;
    private int currentStreak = 0;
    private LocalDateTime lastDonationDate;
    private List<String> earnedBadges = new ArrayList<>();


    private List<String> badgeIds = new ArrayList<>();
    private LocalDateTime createdAt = LocalDateTime.now();
}