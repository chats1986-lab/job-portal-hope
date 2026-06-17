package com.hope.job.controller;

import com.hope.job.payload.JobAlertSuggestRequest;
import com.hope.job.payload.JobAlertSuggestResponse;
import com.hope.job.payload.SearchEnhanceResponse;
import com.hope.job.payload.SearchEnhancedRequest;
import com.hope.job.service.SearchAiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ai/")
public class AiJobSearchController {
    private final SearchAiService searchAiService;

    @PostMapping("/enhance")
    public ResponseEntity<SearchEnhanceResponse> enhanceSearch(
            @RequestBody @Valid SearchEnhancedRequest req
    ) throws Exception {
        return ResponseEntity.ok(searchAiService.enhanceSearch(req));
    }

    @PostMapping("/alert-suggestion")
    public ResponseEntity<JobAlertSuggestResponse> suggestAlertCriteria(
            @RequestBody @Valid JobAlertSuggestRequest req
    ) throws Exception {
        return ResponseEntity.ok(searchAiService.suggestJobAlertCriteria(req));
    }

}
