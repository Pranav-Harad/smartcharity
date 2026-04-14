package com.smartcharity.controller;

import com.smartcharity.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AiController {

    private final GeminiService geminiService;

    @PostMapping("/simplify-report")
    public ResponseEntity<Map<String, String>> simplifyReport(@RequestBody Map<String, String> request) {
        String rawReport = request.get("reportText");
        String prompt = "NGO report text: " + rawReport + ". Summarize in 3 bullets, plain language, max 20 words each.";

        String summary = geminiService.generateSimplifiedReport(prompt);

        // Wrap the string in a Map to ensure it is sent as valid JSON
        return ResponseEntity.ok(Map.of("summary", summary));
    }

}