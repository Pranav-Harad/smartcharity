package com.smartcharity.repository;
import com.smartcharity.model.Ngo;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;
public interface NgoRepository extends MongoRepository<Ngo, String> {
    List<Ngo> findByVerifiedTrue();
    List<Ngo> findByVerifiedFalse(); 
    Optional<Ngo> findByAdminUserId(String adminUserId); 
    List<Ngo> findByCauseIgnoreCaseAndVerified(String cause, boolean verified);
}