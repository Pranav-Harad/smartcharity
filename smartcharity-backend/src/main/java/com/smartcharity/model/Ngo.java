package com.smartcharity.model;

import com.smartcharity.model.subdoc.NgoReport;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "ngos") // Maps to MongoDB 'ngos' collection
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ngo {
    @Id
    private String id;

    private String name;
    private String description;
    private String cause; // e.g., education, food, medical, environment

    private boolean verified = false; // Default to false until Platform Admin approves

    private String adminUserId; // Links the NGO to the NGO_ADMIN user account

    private double totalFundsReceived = 0.0; // Tracked for analytics and leaderboard

    // Stores simplified AI summaries for the donor impact feed [cite: 30, 50]
    private List<NgoReport> reports = new ArrayList<>();

    /* Note: Location and ImpactMetrics are planned for later phases
       and are currently omitted per project status.
    */
}