package com.hope.job.client;

import com.hope.job.dto.response.ResumeResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name="JOB-PORTAL-RESUME-SERVICE")
public interface ResumeClient {
    @GetMapping("/api/resume/{resumeId}")
    ResumeResponse getResumeById(
            @PathVariable Long resumeId,
            @RequestHeader("X-User-id") Long candidateId
    );
}
