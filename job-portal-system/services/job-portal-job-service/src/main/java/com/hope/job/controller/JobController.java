package com.hope.job.controller;

import com.hope.job.dto.request.JobRequest;
import com.hope.job.dto.response.ApiResponse;
import com.hope.job.dto.response.JobResponse;
import com.hope.job.payload.JobSearchRequest;
import com.hope.job.service.JobService;
import com.hope.job.service.SavedJobService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final SavedJobService savedJobService;


    @PostMapping
    public ResponseEntity<JobResponse> createJob(
            @RequestHeader("X-User-Id") Long employerId,
            @RequestBody @Valid JobRequest jobRequest
          ) throws Exception {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(jobService.createJob(employerId, jobRequest));

    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(
            @PathVariable Long id
    ) throws Exception {
       return ResponseEntity.ok(jobService.getJobById(id));
    }

    @GetMapping
    public ResponseEntity<Page<JobResponse>> getJobList(
            @ModelAttribute JobSearchRequest req
            ){
        return ResponseEntity.ok(jobService.getJobList(req));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<JobResponse>> getJobListByCompany(
            @PathVariable Long companyId
    ){
        return ResponseEntity.ok(jobService.getJobsByCompany(companyId));
    }

    @GetMapping("/admin")
    public ResponseEntity<List<JobResponse>> getJobListByAdmin(){
        return ResponseEntity.ok(jobService.getAllJobsAdmin());
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long employerId,
            @RequestBody @Valid JobRequest req
    ) throws Exception {
        return ResponseEntity.ok(jobService.updateJob(id, employerId, req));
    }

    @PatchMapping("/{id}/publish")
    public ResponseEntity<JobResponse> publishJob(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long employerId
    ) throws Exception{
        return ResponseEntity.ok(jobService.publishJob(id, employerId));
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<JobResponse> closeJob(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long employerId
            ) throws Exception{
        return ResponseEntity.ok(jobService.closeJob(id, employerId));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteJob(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long employerId
    ) throws Exception{
        jobService.deleteJob(id, employerId);
        return ResponseEntity.ok(new ApiResponse("Job deleted successfully", true));
    }


    @PostMapping("/{id}/save")
    public ResponseEntity<ApiResponse> saveJob(
        @PathVariable Long id,
        @RequestHeader("X-User-Id") Long userId
    ){
        savedJobService.saveJob(userId, id);
        return ResponseEntity.ok(new ApiResponse("Job saved successfully", true));
    }

    @DeleteMapping("/{id}/unsave")
    public ResponseEntity<ApiResponse> unsaveJob(
        @PathVariable Long id,
        @RequestHeader("X-User-Id") Long userId
    ){
        savedJobService.unsaveJob(userId, id);
        return ResponseEntity.ok(new ApiResponse("Job unsaved successfully", true));
    }

    @GetMapping("/saved")
    public ResponseEntity<List<JobResponse>> getSavedJobs(
        @RequestHeader("X-User-id") Long userId
    ) {
        return ResponseEntity.ok(savedJobService.getSavedJobs(userId));
    }

    @GetMapping("/{id}/is-saved")
    public ResponseEntity<Boolean> isJobSaved(
        @PathVariable Long id,
        @RequestHeader("X-User-Id") Long userId
    ) {
        return ResponseEntity.ok(savedJobService.isJobSaved(userId, id));
    }

}
