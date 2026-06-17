package com.hope.job.controller;

import com.hope.job.dto.response.ApiResponse;
import com.hope.job.dto.response.ResumeSkillResponse;
import com.hope.job.payload.ResumeSkillRequest;
import com.hope.job.service.ResumeSkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/resume/{resumeId}/skills")
public class ResumeSkillController {
    private final ResumeSkillService resumeSkillService;

    @PostMapping
    public ResponseEntity<ResumeSkillResponse> addSkill(
            @PathVariable Long resumeId,
            @RequestHeader("X-User-Id") Long candidateId,
            @RequestBody @Valid ResumeSkillRequest req
    ) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED).body(resumeSkillService.addSkill(resumeId, candidateId,req));
    }

    @GetMapping
    public ResponseEntity<List<ResumeSkillResponse>> getSkill(
            @PathVariable Long resumeId
    ){
        return ResponseEntity.ok(resumeSkillService.getSkills(resumeId));
    }

    @PutMapping("/{skillId}")
    public ResponseEntity<ResumeSkillResponse> updateSkill(
            @PathVariable Long resumeId,
            @PathVariable Long skillId,
            @RequestHeader("X-User-Id") Long candidateId,
            @RequestBody @Valid ResumeSkillRequest req
    ) throws Exception {
        return ResponseEntity.ok(resumeSkillService.updateSkill(skillId, resumeId, candidateId, req));
    }

    @DeleteMapping("/{skillid}")
    public ResponseEntity<ApiResponse> deleteSkill(
            @PathVariable Long resumeId,
            @PathVariable Long skillId,
            @RequestHeader("X-User-Id") Long candidateId
    ) throws Exception {
        resumeSkillService.deleteSkill(skillId, resumeId, candidateId);
        return ResponseEntity.ok( new ApiResponse("Skill deleted successfully", true));
    }
}
