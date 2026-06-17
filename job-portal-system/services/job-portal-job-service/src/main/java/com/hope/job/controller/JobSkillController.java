package com.hope.job.controller;

import com.hope.job.dto.response.ApiResponse;
import com.hope.job.dto.response.JobSkillResponse;
import com.hope.job.payload.JobSkillRequest;
import com.hope.job.service.JobSkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/job-skills")
public class JobSkillController {
    private final JobSkillService jobSkillService;

    @PostMapping
    public ResponseEntity<JobSkillResponse> createJobSkill(
            @RequestBody @Valid JobSkillRequest jobSkillRequest
    ) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED).body(jobSkillService.createSkill(jobSkillRequest));
    }

    @GetMapping
    public ResponseEntity<List<JobSkillResponse>> getAllJobSkills() {
        return ResponseEntity.ok(jobSkillService.getAllSkills());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobSkillResponse> getJobSkillById(@PathVariable Long id) throws Exception {
        return ResponseEntity.ok(jobSkillService.getSkillById(id));
    }


    @PutMapping("/{id}")
    public ResponseEntity<JobSkillResponse> updateJobSkill(
            @PathVariable Long id,
            @RequestBody @Valid JobSkillRequest jobSkillRequest
    ) throws Exception
    {
        return ResponseEntity.ok(jobSkillService.updateSkill(id, jobSkillRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteJobSkillById(@PathVariable Long id) throws Exception {
        jobSkillService.deleteSkillById(id);
        return ResponseEntity.ok(new ApiResponse("Skill deleted successfully", true));
    }

}
