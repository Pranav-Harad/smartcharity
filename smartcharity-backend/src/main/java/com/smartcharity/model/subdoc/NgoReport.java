package com.smartcharity.model.subdoc;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NgoReport {
    private String rawText;           
    private List<String> aiSummary;    
    private LocalDateTime uploadedAt;  
}