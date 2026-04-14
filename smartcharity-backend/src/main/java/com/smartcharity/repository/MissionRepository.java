package com.smartcharity.repository;

import com.smartcharity.model.Mission;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MissionRepository extends MongoRepository<Mission, String> {
    // Standard CRUD methods are inherited from MongoRepository [cite: 50]
}