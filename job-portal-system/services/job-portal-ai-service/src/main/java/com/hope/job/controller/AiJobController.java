package com.hope.job.controller;

import com.hope.job.payload.AiTextResponse;
import com.hope.job.payload.JobDescriptionRequest;
import com.hope.job.payload.SalaryRangeRequest;
import com.hope.job.payload.SalaryRangeResponse;
import com.hope.job.service.JobAiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ai/job")
public class AiJobController {
    private final JobAiService jobAiService;

    @PostMapping("/describe")
    public ResponseEntity<AiTextResponse> generateJobDescription(
            @RequestBody @Valid JobDescriptionRequest req
    ) throws Exception {
        return ResponseEntity.ok(jobAiService.generateJobDescription(req));
    }

    @GetMapping("/requirements")
    public ResponseEntity<AiTextResponse> generateJobRequirements(
            @RequestParam String title,
            @RequestParam(required = false) String description
    ) throws Exception {
        return ResponseEntity.ok(jobAiService.generateJobRequirements(title, description));
    }

    @PostMapping("/salary-suggestion")
    public ResponseEntity<SalaryRangeResponse> suggestSalary(
            @RequestBody @Valid SalaryRangeRequest req
    ) throws Exception {
        return ResponseEntity.ok(jobAiService.suggestSalaryRange(req));
    }

    @GetMapping("/skills-recommendation")
    public ResponseEntity<AiTextResponse> suggestSkillsRecommendation(
            @RequestParam String title,
            @RequestParam(required = false) String description
    ) throws Exception {
        return ResponseEntity.ok(jobAiService.recommendSkillsForJob(title, description));
    }

    @GetMapping("/responsibilities")
    public ResponseEntity<AiTextResponse> generateJobResponsibilities(
            @RequestParam String title,
            @RequestParam(required = false) String description
    ) throws Exception {
        return ResponseEntity.ok(jobAiService.generateJobResponsibilities(title, description));
    }

    @GetMapping("/benefits")
    public ResponseEntity<AiTextResponse> generateJobBenefits(
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String jobType
    ) throws Exception {
        return ResponseEntity.ok(jobAiService.generateJobBenefits(title, description, jobType));
    }

    @GetMapping("/tag-recommendation")
    public ResponseEntity<AiTextResponse> generateJobTagRecommendation(
            @RequestParam String title,
            @RequestParam(required = false) String description

    )throws Exception{
        return ResponseEntity.ok(jobAiService.recommendedTagsForJob(title, description));
    }



}
