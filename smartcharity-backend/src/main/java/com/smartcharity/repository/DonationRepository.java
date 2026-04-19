package com.smartcharity.repository;
import com.smartcharity.model.Donation;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
public interface DonationRepository extends MongoRepository<Donation, String> {
    List<Donation> findByUserId(String userId);
    List<Donation> findByNgoId(String ngoId);
    List<Donation> findTop10ByOrderByTimestampDesc();
}