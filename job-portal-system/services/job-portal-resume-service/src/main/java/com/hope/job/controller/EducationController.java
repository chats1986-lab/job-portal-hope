package com.hope.job.controller;

import com.hope.job.dto.response.ApiResponse;
import com.hope.job.dto.response.EducationResponse;
import com.hope.job.payload.EducationRequest;
import com.hope.job.service.EducationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/resume/{resumeId}/educations")
public class EducationController {
    private final EducationService educationService;

    @PostMapping
    public ResponseEntity<EducationResponse> addEducation(
            @PathVariable Long resumeId,
            @RequestHeader("X-User-Id") Long candidateId,
            @RequestBody @Valid EducationRequest req
    ) throws Exception {
        return ResponseEntity.ok(
                educationService.addEducation(resumeId,  candidateId, req)
        );
    }

    @GetMapping
    public ResponseEntity<List<EducationResponse>>  getEducations(
            @PathVariable Long resumeId
    ){
        return ResponseEntity.ok(educationService.getEducations(resumeId));
    }

    @PutMapping("/{educationId}")
    public ResponseEntity<EducationResponse> updateEducation(
            @PathVariable Long resumeId,
            @PathVariable Long educationId,
            @RequestHeader("X-User-Id") Long candidateId,
            @RequestBody @Valid EducationRequest req
    ) throws Exception {
        return ResponseEntity.ok(educationService.updateEducation(educationId, resumeId, candidateId, req));
    }

    @DeleteMapping("/{educationId}")
    public ResponseEntity<ApiResponse>  deleteEducation(
            @PathVariable Long resumeId,
            @PathVariable Long educationId,
            @RequestHeader("X-User-Id") Long candidateId
    ) throws Exception {
       educationService.deleteEducation(educationId, resumeId, candidateId);
        return ResponseEntity.ok(new ApiResponse("Education deleted successfully", true));
    }
}
