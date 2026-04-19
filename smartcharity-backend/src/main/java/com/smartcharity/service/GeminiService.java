package com.smartcharity.service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcharity.model.Donation;
import com.smartcharity.model.Ngo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.List;
@Service
public class GeminiService {
    @Value("${gemini.api.key}")
    private String apiKey;
    @Value("${gemini.api.url}")
    private String baseUrl;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    public String generateImpactStory(Donation donation, Ngo ngo) {
        String prompt = String.format(
                "A user donated Rs.%.0f to the NGO '%s' which focuses on %s. " +
                        "Write a very short, heart-warming 2-sentence impact story in the third person " +
                        "about how this specific amount helps a life. Do not use hashtags.",
                donation.getAmount(), ngo.getName(), ngo.getCause());
        return callGemini(prompt);
    }
    public String generateSimplifiedReport(String prompt) {
        return callGemini(prompt);
    }
    private String callGemini(String prompt) {
        String url = baseUrl + "/models/gemini-1.5-flash:generateContent?key=" + apiKey;
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );
        try {
            String response = restTemplate.postForObject(url, requestBody, String.class);
            JsonNode root = objectMapper.readTree(response);
            return root.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        } catch (Exception e) {
            return "Your contribution is making a real difference in the lives of those supported by our verified partners!";
        }
    }
}