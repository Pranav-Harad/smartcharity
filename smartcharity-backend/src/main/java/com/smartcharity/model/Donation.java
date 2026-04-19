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
    private String userId;        
    private String ngoId;
    private double amount;
    private String currency = "INR";
    private String cause;
    private String status;         
    private String auditHash;
    private String paymentRef;     
    private LocalDateTime timestamp = LocalDateTime.now();
    private String impactStory;
    public String getDonorId() {
        return this.userId;
    }
}