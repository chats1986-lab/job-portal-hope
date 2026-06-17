package com.hope.job.controller;

import com.hope.job.dto.response.ApiResponse;
import com.hope.job.dto.response.JobTagResponse;
import com.hope.job.payload.JobTagRequest;
import com.hope.job.service.JobTagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/job-tags")
public class JobTagController {

    private final JobTagService jobTagService;

    @PostMapping
    public ResponseEntity<JobTagResponse> createJobTag(
            @RequestBody @Valid JobTagRequest jobTagRequest
    ) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED).body(jobTagService.createJobTag(jobTagRequest));
    }

    @GetMapping
    public ResponseEntity<List<JobTagResponse>> getAllJobTags(){
        return ResponseEntity.ok(jobTagService.getAllJobTags());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobTagResponse> getJobTagById(
            @PathVariable Long id
    ) throws Exception {
        return ResponseEntity.ok(jobTagService.getJobTagById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobTagResponse> updateJobTag(
            @PathVariable Long id,
            @RequestBody @Valid JobTagRequest jobTagRequest
    ) throws Exception {
        return ResponseEntity.ok(jobTagService.updateJobTag(id, jobTagRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse>  deleteJobTag(
            @PathVariable Long id
    ){
        return ResponseEntity.ok(new ApiResponse("Job Tag deleted successfully", true));
    }

}
