package com.hope.job.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

import com.hope.job.domain.UserRole;

@RestController
public class HomeController {
    @GetMapping("/")
    public String home() {
        return "Hello World " + UserRole.ROLE_EMPLOYER;
    }
}
