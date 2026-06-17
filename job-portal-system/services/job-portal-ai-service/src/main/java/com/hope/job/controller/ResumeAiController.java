package com.hope.job.controller;

import com.hope.job.payload.*;
import com.hope.job.service.ResumeAiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ai/resume")
public class ResumeAiController {
    private final ResumeAiService resumeAiService;

    @PostMapping("/summary")
    public ResponseEntity<AiTextResponse> generateSummary(
            @RequestBody @Valid ResumeSummaryRequest request
            ) throws Exception {
        return ResponseEntity.ok(resumeAiService.generateProfessionalSummary(request));
    }

    @PostMapping("/experience-bullets")
    public ResponseEntity<WorkExperienceBulletResponse> generateSummary(
            @RequestBody @Valid WorkExperienceBulletRequest request
    ) throws Exception {
        return ResponseEntity.ok(resumeAiService.generateWorkExperienceBullets(request));
    }

    @PostMapping("/improvements")
    public ResponseEntity<ResumeImprovementResponse> generateSummary(
            @RequestBody @Valid ResumeImprovementRequest request
    ) throws Exception {
        return ResponseEntity.ok(resumeAiService.getResumeImprovementTips(request));
    }

    @PostMapping("/carrer-feedback")
    public ResponseEntity<CareerFeedbackResponse> generateSummary(
            @RequestBody @Valid CarrerFeedbackRequest request
    ) throws Exception {
        return ResponseEntity.ok(resumeAiService.getCareerFeedback(request));
    }

}
