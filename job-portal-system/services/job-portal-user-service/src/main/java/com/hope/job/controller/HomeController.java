package com.hope.job.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hope.job.domain.UserRole;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Home " + UserRole.ROLE_ADMIN;
    }

}
