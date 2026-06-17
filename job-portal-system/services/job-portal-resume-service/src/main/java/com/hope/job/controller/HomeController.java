package com.hope.job.controller;

import com.hope.job.dto.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping("/")
    public ApiResponse home() {
        return new ApiResponse("Job Resume Service is running", true);
    }
}
