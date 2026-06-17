package com.hope.job.client;

import com.hope.job.dto.response.ResumeResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name="JOB-PORTAL-RESUME-SERVICE")
public interface ResumeClient {
    @GetMapping("/api/resumes/{id}")
    ResumeResponse getResumeById(
            @PathVariable String id
    );
}
