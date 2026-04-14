package com.smartcharity.repository;

import com.smartcharity.model.Ngo;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface NgoRepository extends MongoRepository<Ngo, String> {
    List<Ngo> findByVerifiedTrue();
    List<Ngo> findByVerifiedFalse(); // For Super Admin [cite: 136]
    Optional<Ngo> findByAdminUserId(String adminUserId); // For NGO Dashboard
    List<Ngo> findByCauseIgnoreCaseAndVerified(String cause, boolean verified);
}