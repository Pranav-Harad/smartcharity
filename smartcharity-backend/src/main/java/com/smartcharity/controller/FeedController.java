package com.smartcharity.controller;
import com.smartcharity.service.ImpactFeedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController
@RequestMapping("/api/feed")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class FeedController {
    private final ImpactFeedService impactFeedService;
    @GetMapping("/global-stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(impactFeedService.getGlobalMetrics());
    }
}