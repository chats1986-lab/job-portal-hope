package com.hope.job.client;

import com.hope.job.dto.response.ApplicationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name="JOB-PORTAL-APPLICATION-SERVICE")
public interface ApplicationClient {
    @GetMapping("/api/applications/{id}")
    ApplicationResponse getApplicationById(
            @PathVariable Long id
    );
}
