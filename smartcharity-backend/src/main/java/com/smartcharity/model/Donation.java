package com.smartcharity.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Donation {
    @Id
    private String id;

    private String userId;        // This represents the Donor ID
    private String ngoId;
    private double amount;
    private String currency = "INR";
    private String cause;
    private String status;         // PENDING / SUCCESS / FAILED

    // Cryptographic SHA-256 of userId+ngoId+amount+timestamp for audit integrity
    private String auditHash;

    private String paymentRef;     // Razorpay / Stripe order ID
    private LocalDateTime timestamp = LocalDateTime.now();

    // AI-generated story from Gemini (Phase 4 integration)
    private String impactStory;

    /**
     * Helper method to maintain consistency with the 'Donor' terminology
     * used in the service layers.
     */
    public String getDonorId() {
        return this.userId;
    }
}