package com.hope.job.controller;

import com.hope.job.dto.response.ApiResponse;
import com.hope.job.dto.response.ApplicationResponse;
import com.hope.job.payload.ApplicationRequest;
import com.hope.job.payload.CompanyApplicationFilterRequest;
import com.hope.job.payload.UpdateApplicationStatusRequest;
import com.hope.job.payload.WithdrawApplicationRequest;
import com.hope.job.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/applications")
public class ApplicationController {
    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<ApplicationResponse> createApplication(
            @RequestHeader("X-User-Id") Long candidateId,
            @RequestBody @Valid ApplicationRequest applicationRequest) throws Exception{
        return ResponseEntity.ok(applicationService.createApplication(candidateId, applicationRequest));
    }

    @GetMapping("{id}")
    public ResponseEntity<ApplicationResponse> getApplicationById(@PathVariable Long id) throws Exception{
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(
            @RequestHeader("X-User-Id") Long applicationId
    ) {
        return ResponseEntity.ok(applicationService.getMyApplication(applicationId));
    }

    @GetMapping("/company")
    public ResponseEntity<List<ApplicationResponse>> getMyApplicationsForCompany(
            @RequestHeader("X-User-Id") Long candidateId,
            @ModelAttribute CompanyApplicationFilterRequest filter
    ){
        return ResponseEntity.ok(applicationService.getApplicationsForCompany(candidateId, filter));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long employerId,
            @RequestBody @Valid UpdateApplicationStatusRequest req
    ) throws Exception {
        return ResponseEntity.ok(applicationService.updateStatus(id, employerId, req.getStatus()));
    }

    @PatchMapping("{id}/withdraw")
    public ResponseEntity<ApplicationResponse> withdrawApplication(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long candidateId,
            @RequestBody @Valid WithdrawApplicationRequest req
    ) throws Exception {
        return ResponseEntity.ok(applicationService.withdrawApplication(id, candidateId, req));
    }

    @PatchMapping("/{id}/star")
    public ResponseEntity<ApplicationResponse> toggleStar(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long employerId
    ) throws Exception {
        return ResponseEntity.ok(applicationService.toggleStar(id, employerId));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse> deleteApplication(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long candidateId
    ) throws Exception {
        applicationService.deleteApplication(id, candidateId);
        return ResponseEntity.ok(new ApiResponse("Application deleted successfully", true));
    }

}
