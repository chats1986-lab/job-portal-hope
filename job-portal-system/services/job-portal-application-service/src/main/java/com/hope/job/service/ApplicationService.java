package com.hope.job.service;

import com.hope.job.domain.ApplicationStatus;
import com.hope.job.dto.response.ApplicationResponse;
import com.hope.job.modal.Application;
import com.hope.job.payload.ApplicationRequest;
import com.hope.job.payload.CompanyApplicationFilterRequest;
import com.hope.job.payload.WithdrawApplicationRequest;

import java.util.List;

public interface ApplicationService {
    ApplicationResponse createApplication(Long candidateId, ApplicationRequest req);
    ApplicationResponse getApplicationById(Long id);
    List<ApplicationResponse> getMyApplication(Long candidateId);

    List<ApplicationResponse> getApplicationsForCompany(Long userId, CompanyApplicationFilterRequest request);
    List<ApplicationResponse> getApplicationsForJob(Long jobId);

    ApplicationResponse updateStatus(Long applicationId, Long employerId, ApplicationStatus status);

    ApplicationResponse withdrawApplication(Long applicationId, Long candidateId, WithdrawApplicationRequest request);

    ApplicationResponse toggleStar(Long applicationId, Long employerId);

    void deleteApplication(Long applicationId, Long candidateId);

    Application getApplicationEntity(Long id);

}
