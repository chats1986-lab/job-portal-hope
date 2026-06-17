package com.hope.job.event;

import com.hope.job.client.CompanyClient;
import com.hope.job.client.JobClient;
import com.hope.job.client.UserClient;
import com.hope.job.domain.ApplicationStatus;
import com.hope.job.dto.response.CompanyResponse;
import com.hope.job.dto.response.JobResponse;
import com.hope.job.dto.response.UserResponse;
import com.hope.job.exception.BusinessException;
import com.hope.job.modal.Application;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class ApplicationEventPublisher {
    public static final String TOPIC = "application.status.changed";
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final UserClient userClient;
    private final JobClient jobClient;
    private final CompanyClient companyClient;

    public void publishStatusChange(Application app,
                                    ApplicationStatus oldStatus,
                                    ApplicationStatus newStatus,
                                    String note) {

        try{
            UserResponse candidate = userClient.getUserById(app.getCandidateId());
            JobResponse job = jobClient.getJobById(app.getJobId());
            CompanyResponse company = companyClient.getCompanyId(app.getCompanyId());

            ApplicationStatusChangedEvent event =  ApplicationStatusChangedEvent.builder()
                    .applicationId(app.getId())
                    .candidateId(app.getCandidateId())
                    .candidateEmail(candidate.getEmail())
                    .candidateName(candidate.getFullName())
                    .oldStatus(oldStatus)
                    .newStatus(newStatus)
                    .note(note)
                    .jobTitle(job.getTitle())
                    .companyName(company.getName())
                    .changedAt(LocalDateTime.now())
                    .build();
            kafkaTemplate.send(TOPIC, String.valueOf(app.getId()), event);
        }catch (Exception e){
            throw new BusinessException("Error in publishStatusChange event " + e.getMessage());
        }


    }
}
