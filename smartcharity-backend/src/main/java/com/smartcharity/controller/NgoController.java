package com.smartcharity.controller;

import com.smartcharity.model.Ngo;
import com.smartcharity.repository.NgoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ngos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.OPTIONS})
public class NgoController {

    private final NgoRepository ngoRepository;

    // GET /api/ngos - List all verified NGOs
    @GetMapping
    public ResponseEntity<List<Ngo>> getAllNgos() {
        return ResponseEntity.ok(ngoRepository.findByVerifiedTrue());
    }

    // GET /api/ngos/{id} - Get details for a single NGO
    @GetMapping("/{id}")
    public ResponseEntity<Ngo> getNgoById(@PathVariable String id) {
        return ngoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Ngo>> searchNgos(@RequestParam String cause) {
        if (cause.equalsIgnoreCase("All")) {
            return ResponseEntity.ok(ngoRepository.findByVerifiedTrue());
        }
        // Use the IgnoreCase method we just added
        return ResponseEntity.ok(ngoRepository.findByCauseIgnoreCaseAndVerified(cause, true));
    }

    // POST /api/ngos - Register a new NGO (Admin route)
    @PostMapping
    public ResponseEntity<Ngo> createNgo(@RequestBody Ngo ngo) {
        ngo.setVerified(true); // Manually verifying for dev purposes
        return ResponseEntity.ok(ngoRepository.save(ngo));
    }
    @GetMapping("/pending")
    public ResponseEntity<List<Ngo>> getPendingNgos() {
        // We need to add findByVerifiedFalse() to your NgoRepository
        return ResponseEntity.ok(ngoRepository.findByVerifiedFalse());
    }

    @PatchMapping("/{id}/verify")
    public ResponseEntity<Ngo> verifyNgo(@PathVariable String id) {
        return ngoRepository.findById(id)
                .map(ngo -> {
                    ngo.setVerified(true);
                    return ResponseEntity.ok(ngoRepository.save(ngo));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/admin/{adminId}")
    public ResponseEntity<Ngo> getNgoByAdmin(@PathVariable String adminId) {
        return ngoRepository.findByAdminUserId(adminId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}