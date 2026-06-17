package com.hope.job.event;

import com.hope.job.service.EmailNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationKafkaConsumer {
    private final EmailNotificationService emailService;

    @KafkaListener(
            topics="application.status.changed",
            groupId = "notification-service",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleStatusChanged(ApplicationStatusChangedEvent event) throws Exception {
        System.out.println("received statusChangedEvent : " + event);
        emailService.sendStatusChangedEmail(event);
    }
}
