package com.hope.job.service;

import com.hope.job.event.ApplicationStatusChangedEvent;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailNotificationService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendStatusChangedEmail(ApplicationStatusChangedEvent event) throws Exception {
        try{
            String subject = "Hope - Application status updated: " + event.getJobTitle() + " at " + event.getCompanyName();
            String body = buildStatusChangeHtml(event);
            String candidateEmail = event.getCandidateEmail();
            sendEmail(candidateEmail, subject, body);
        }catch(Exception e){
            throw new Exception(e.getMessage());
        }

    }

    private void sendEmail(String candidateEmail, String subject, String body) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(candidateEmail);
        helper.setSubject(subject);
        helper.setText(body, true);
        mailSender.send(mimeMessage);
    }

    private String buildStatusChangeHtml(ApplicationStatusChangedEvent event){
        return "<h1>Application status changed to: " + event.getNewStatus() + " </h1>";
    }
}
