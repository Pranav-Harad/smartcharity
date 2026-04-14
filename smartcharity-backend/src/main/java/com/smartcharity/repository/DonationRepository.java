package com.smartcharity.repository;

import com.smartcharity.model.Donation;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DonationRepository extends MongoRepository<Donation, String> {
    // Finds all donations made by a specific user [cite: 52]
    List<Donation> findByUserId(String userId);

    List<Donation> findTop10ByOrderByTimestampDesc();
}