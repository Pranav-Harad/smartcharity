package com.smartcharity.model;
import com.smartcharity.model.subdoc.NgoReport;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;
@Document(collection = "ngos") 
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ngo {
    @Id
    private String id;
    private String name;
    private String description;
    private String cause; 
    private boolean verified = false; 
    private String adminUserId; 
    private double mainGoal = 0.0; 
    private double totalFundsReceived = 0.0; 
    private List<NgoReport> reports = new ArrayList<>();
}