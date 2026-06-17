package com.hope.job.controller;

import com.hope.job.dto.response.ApiResponse;
import com.hope.job.dto.response.PersonalInfoResponse;
import com.hope.job.dto.response.ResumeResponse;
import com.hope.job.payload.ResumeRequest;
import com.hope.job.service.ResumeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/resume")
public class ResumeController {
    private final ResumeService resumeService;

    @PostMapping
    public ResponseEntity<ResumeResponse> createResume(
            @RequestHeader("X-User-id") Long candidateId,
            @RequestBody @Valid ResumeRequest req
    ){
        return ResponseEntity.ok(resumeService.createResume(candidateId, req));
    }

    @GetMapping("/{resumeId}")
    public ResponseEntity<ResumeResponse> getResumeById(
            @PathVariable Long resumeId,
            @RequestHeader("X-User-id") Long candidateId
    ) throws Exception {
        return ResponseEntity.ok(resumeService.getResumeById(resumeId, candidateId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ResumeResponse>> getMyResumes(
            @RequestHeader("X-User-id") Long candidateId
    ){
        return ResponseEntity.ok(resumeService.getMyResumes(candidateId));
    }

    @PutMapping("/{resumeId}/personal-info")
    public ResponseEntity<ResumeResponse> updateResumePersonalInfo(
            @PathVariable Long resumeId,
            @RequestHeader("X-User-id") Long candidateId,
            @RequestBody @Valid PersonalInfoResponse req
    ) throws Exception {
        return ResponseEntity.ok(resumeService.updatePersonalInfo(resumeId, candidateId, req));
    }

    @PatchMapping("/{resumeId}/summary")
    public ResponseEntity<ResumeResponse> updateResumeSummary(
            @PathVariable Long resumeId,
            @RequestHeader("X-User-id") Long candidateId,
            @RequestParam String summary
    ) throws Exception {
        return ResponseEntity.ok(resumeService.updateSummary(resumeId, candidateId, summary));
    }

    @PatchMapping("/{resumeId}/set-default")
    public ResponseEntity<ResumeResponse> updateResumeDefault(
            @PathVariable Long resumeId,
            @RequestHeader("X-User-id") Long candidateId
    ) throws Exception {
        return ResponseEntity.ok(resumeService.setDefaultResume(resumeId, candidateId));
    }

    @DeleteMapping("/{resumeId}")
    public ResponseEntity<ApiResponse> deleteResumeById(
            @PathVariable Long resumeId,
            @RequestHeader("X-User-id") Long candidateId
    ){
        return ResponseEntity.ok(new ApiResponse("Resume deleted successfully", true));
    }

}
