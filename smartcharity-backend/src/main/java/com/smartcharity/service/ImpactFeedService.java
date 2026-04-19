package com.smartcharity.service;
import com.smartcharity.model.Donation;
import com.smartcharity.model.Ngo;
import com.smartcharity.repository.DonationRepository;
import com.smartcharity.repository.NgoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
@RequiredArgsConstructor
public class ImpactFeedService {
    private final DonationRepository donationRepository;
    private final NgoRepository ngoRepository;
    public Map<String, Object> getGlobalMetrics() {
        List<Ngo> ngos = ngoRepository.findAll();
        List<Donation> donations = donationRepository.findAll();
        double totalRaised = ngos.stream()
                .filter(Ngo::isVerified)
                .mapToDouble(Ngo::getTotalFundsReceived)
                .sum();
        long totalDonors = donations.stream()
                .map(Donation::getDonorId)
                .distinct()
                .count();
        long livesTouched = (long) (totalRaised / 500);
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalRaised", totalRaised);
        metrics.put("livesTouched", livesTouched);
        metrics.put("totalDonors", totalDonors);
        metrics.put("activeNgos", ngos.stream().filter(Ngo::isVerified).count());
        metrics.put("recentDonations", donationRepository.findTop10ByOrderByTimestampDesc());
        return metrics;
    }
}