package com.hope.job.controller;

import com.hope.job.dto.response.ApiResponse;
import com.hope.job.dto.response.WorkExperienceResponse;
import com.hope.job.payload.WorkExperienceRequest;
import com.hope.job.service.WorkExperienceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/resume/{resumeId}/work-experiences")
public class WorkExperienceController {
    private final WorkExperienceService workExperienceService;

    @PostMapping
    public ResponseEntity<WorkExperienceResponse> addWorkExperience(
            @PathVariable Long resumeId,
            @RequestHeader("X-User-Id") Long candidateId,
            @RequestBody @Valid WorkExperienceRequest req) throws Exception {
        return ResponseEntity.ok(workExperienceService.addWorkExperience(resumeId, candidateId, req));
    }

    @GetMapping
    public ResponseEntity<List<WorkExperienceResponse>> getWorkExperience(
        @RequestHeader("X-User-Id") Long candidateId,
        @PathVariable Long resumeId
    ){
        return ResponseEntity.ok(workExperienceService.getWorkExperiences(resumeId, candidateId));
    }

    @PutMapping("/experienceId")
    public ResponseEntity<WorkExperienceResponse> updateWorkExperience(
            @PathVariable Long resumeId,
            @PathVariable Long experienceId,
            @RequestParam WorkExperienceRequest workExperienceRequest,
            @RequestHeader("X-User-Id") Long candidateId,
            @RequestBody @Valid WorkExperienceRequest req
            ) throws Exception {
        return ResponseEntity.ok(workExperienceService.updateWorkExperience( resumeId, candidateId,experienceId, req));
    }


    @DeleteMapping("/{experienceId}")
    public ResponseEntity<ApiResponse> deleteWorkExperience(
            @PathVariable Long resumeId,
            @PathVariable Long experienceId,
            @RequestHeader("X-User-Id") Long candidateId
    ) throws Exception {
        workExperienceService.deleteWorkExperience(experienceId, resumeId, candidateId);
        return ResponseEntity.ok(new ApiResponse("Delete work experience successfully", true));

    }

}
