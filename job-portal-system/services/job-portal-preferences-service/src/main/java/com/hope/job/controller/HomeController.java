package com.hope.job.controller;
import com.hope.job.domain.UserRole;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping("/")
    public String home() {
        return "Hello World " + UserRole.ROLE_ADMIN;
    }
}
