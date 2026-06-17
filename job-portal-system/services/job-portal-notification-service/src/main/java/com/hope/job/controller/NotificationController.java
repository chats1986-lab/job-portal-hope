package com.hope.job.controller;

import com.hope.job.service.EmailNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifcations")
public class NotificationController {
    private final EmailNotificationService emailNotificationService;

    @GetMapping("/send")
    public String Notification() throws Exception {
    //    emailNotificationService.sendStatusChangedEmail();
       return "Email sent successfully!";
    }

}

