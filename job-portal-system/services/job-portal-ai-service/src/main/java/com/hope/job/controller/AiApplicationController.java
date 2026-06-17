package com.hope.job.controller;

import com.hope.job.client.ApplicationClient;
import com.hope.job.client.JobClient;
import com.hope.job.client.ResumeClient;
import com.hope.job.dto.response.ApplicationResponse;
import com.hope.job.dto.response.JobResponse;
import com.hope.job.dto.response.JobSkillResponse;
import com.hope.job.dto.response.ResumeResponse;
import com.hope.job.dto.response.ResumeSkillResponse;
import com.hope.job.payload.*;
import com.hope.job.service.ApplicationAiService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ai/application")
public class AiApplicationController {

    private final ApplicationAiService applicationService;
    private final ApplicationClient applicationClient;
    private final JobClient jobClient;
    private final ResumeClient resumeClient;

    @PostMapping("/cover-letter")
    public ResponseEntity<AiTextResponse> generateCoverLetter(
            @RequestBody @Valid CoverLetterRequest req
    ) throws Exception {
        return ResponseEntity.ok(applicationService.generateCoverLetter(req));
    }

    @PostMapping("/screening-score")
    public ResponseEntity<ScreeningScoreResponse> scoreCandidate(
            @RequestBody @Valid ScreeningScoreRequest req
    ) throws Exception {
        return ResponseEntity.ok(applicationService.scoreCandidate(req));
    }

    @GetMapping("/screening-score/{applicationId}")
    public ResponseEntity<ScreeningScoreResponse> scoreCandidateByApplicationId(
            @PathVariable Long applicationId
    ) throws Exception {
        // Fetch application details
        ApplicationResponse application = applicationClient.getApplicationById(applicationId);

        // Fetch job details to get requirements
        JobResponse job = jobClient.getJobById(application.getJob().getId());

        // Fetch resume to get candidate skills and experiences
        List<String> candidateSkills = List.of();
        List<String> candidateExperiences = List.of();
        String candidateSummary = "Experienced Professional";

        if (application.getResumeId() != null) {
            ResumeResponse resume = resumeClient.getResumeById(application.getResumeId().toString());
            if (resume != null) {
                if (resume.getSkills() != null) {
                    candidateSkills = resume.getSkills().stream()
                            .map(ResumeSkillResponse::getSkillName)
                            .toList();
                }
                if (resume.getWorkExperiences() != null) {
                    candidateExperiences = resume.getWorkExperiences().stream()
                            .map(we -> we.getJobTitle() + " at " + we.getCompanyName())
                            .toList();
                }
                if (resume.getSummary() != null && !resume.getSummary().isEmpty()) {
                    candidateSummary = resume.getSummary();
                }
            }
        }

        // Build the request
        ScreeningScoreRequest request = new ScreeningScoreRequest();
        request.setJobTitle(job.getTitle());
        request.setExperienceLevel(job.getExperienceLevel() != null ? job.getExperienceLevel().name() : "Not specified");
        request.setRequiredSkills(job.getJobSkills() != null ?
                job.getJobSkills().stream().map(JobSkillResponse::getSkillName).toList() : List.of());
        request.setResponsibilities(job.getResponsibilities());
        request.setCandidateSummary(candidateSummary);
        request.setCandidateSkills(candidateSkills);
        request.setCandidateExperiences(candidateExperiences);

        return ResponseEntity.ok(applicationService.scoreCandidate(request));
    }

    @PostMapping("/skills-gap")
    public ResponseEntity<SkillsGapResponse> analyzeSkillsGap(@RequestBody SkillsGapRequest req) throws Exception{
        return ResponseEntity.ok(applicationService.analyzeSkillsGap(req));
    }

    @GetMapping("/skills-gap/{applicationId}")
    public ResponseEntity<SkillsGapResponse> analyzeSkillsGapByApplicationId(
            @PathVariable Long applicationId
    ) throws Exception {
        // Fetch application details
        ApplicationResponse application = applicationClient.getApplicationById(applicationId);

        // Fetch job details to get requirements
        JobResponse job = jobClient.getJobById(application.getJob().getId());

        // Fetch resume to get candidate skills
        List<String> candidateSkills = List.of();
        if (application.getResumeId() != null) {
            ResumeResponse resume = resumeClient.getResumeById(application.getResumeId().toString());
            if (resume != null && resume.getSkills() != null) {
                candidateSkills = resume.getSkills().stream()
                        .map(ResumeSkillResponse::getSkillName)
                        .toList();
            }
        }

        // Build the request
        SkillsGapRequest request = new SkillsGapRequest();
        request.setJobTitle(job.getTitle());
        request.setCandidateSkills(candidateSkills);
        request.setRequiredSkills(job.getJobSkills() != null ?
                job.getJobSkills().stream().map(JobSkillResponse::getSkillName).toList() : List.of());

        return ResponseEntity.ok(applicationService.analyzeSkillsGap(request));
    }

}
