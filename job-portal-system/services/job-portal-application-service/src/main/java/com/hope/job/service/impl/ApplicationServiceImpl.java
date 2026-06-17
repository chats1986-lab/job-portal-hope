package com.hope.job.service.impl;

import com.hope.job.client.CompanyClient;
import com.hope.job.client.JobClient;
import com.hope.job.client.ResumeClient;
import com.hope.job.client.UserClient;
import com.hope.job.domain.ApplicationStatus;
import com.hope.job.dto.response.*;
import com.hope.job.event.ApplicationEventPublisher;
import com.hope.job.exception.BusinessException;
import com.hope.job.exception.ResourceNotFoundException;
import com.hope.job.mapper.ApplicationMapper;
import com.hope.job.modal.Application;
import com.hope.job.modal.ApplicationNote;
import com.hope.job.payload.ApplicationRequest;
import com.hope.job.payload.CompanyApplicationFilterRequest;
import com.hope.job.payload.WithdrawApplicationRequest;
import com.hope.job.repository.ApplicationNoteRepository;
import com.hope.job.repository.ApplicationRepository;
import com.hope.job.repository.ApplicationSpecification;
import com.hope.job.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final ApplicationNoteRepository applicationNoteRepository;
    private final JobClient jobClient;
    private final ResumeClient resumeClient;
    private final CompanyClient companyClient;
    private final UserClient userClient;
    private final ApplicationEventPublisher applicationEventPublisher;

    @Override
    public ApplicationResponse createApplication(Long candidateId, ApplicationRequest req) {

        if(applicationRepository.existsByCandidateIdAndJobId(candidateId, req.getJobId())){
            throw new BusinessException("You have already applied for this Job");
        }

        JobResponse job = jobClient.getJobById(req.getJobId());
        ResumeResponse resume = resumeClient.getResumeById(req.getResumeId(), candidateId);
        Long companyId = job.getCompany().getId();
        Long employerId = job.getEmployerId();

        Application savedapplication = ApplicationMapper.toEntity(req, candidateId, companyId, employerId);

        Application savedApplication = applicationRepository.save(savedapplication);

        // todo : ai screening runs in the background thread, no callback needed

        return buildFullResponse(savedApplication);
    }

    @Override
    public ApplicationResponse getApplicationById(Long id) {
         Application application = getApplicationEntity(id);
         return buildFullResponse(application);
    }

    @Override
    public List<ApplicationResponse> getMyApplication(Long candidateId) {
        return applicationRepository.findByCandidateId(candidateId)
                .stream()
                .map(
                        this::buildFullResponse
                ).toList();
    }

    @Override
    public List<ApplicationResponse> getApplicationsForJob(Long jobId) {
        return applicationRepository.findByJobId(jobId)
                .stream()
                .map(
                        this::buildFullResponse
                ).toList();
    }


    @Override
    public List<ApplicationResponse> getApplicationsForCompany(Long userId, CompanyApplicationFilterRequest filter) {

        Long companyId = companyClient.getMyCompany(userId).getId();
        Sort sort = buildSort(filter.getSortBy());
        return applicationRepository.findAll(
                ApplicationSpecification.forCompanyWithFilters(
                    companyId,
                    filter.getJobId(),
                    filter.getStatus(),
                    filter.isStarred(),
                    filter.getMinAiScore(),
                    filter.getAiShortListStatus(),
                    filter.getMinAiScore()
                ),sort)
                .stream()
                .map(
                        this::buildFullResponse
                ).collect(Collectors.toList());
    }


    @Override
    public ApplicationResponse updateStatus(Long applicationId, Long employerId, ApplicationStatus status) {


        Application application = getApplicationEntity(applicationId);
        ApplicationStatus oldStatus = application.getStatus();
        assertEmployer(application, employerId);
        if(application.getStatus() == ApplicationStatus.WITHDRAWN){
            throw new BusinessException("Candidate has already withdrawn");
        }
        application.setStatus(status);
        Application savedApplication = applicationRepository.save(application);

        applicationEventPublisher.publishStatusChange(application,oldStatus, status, "Your application has been updated" );
        return buildFullResponse(applicationRepository.save(savedApplication));
    }



    @Override
    public ApplicationResponse withdrawApplication(Long applicationId, Long candidateId, WithdrawApplicationRequest request) {
        Application application = getApplicationEntity(applicationId);
        assertCandidate(application, candidateId);
        application.setStatus(ApplicationStatus.WITHDRAWN);
        application.setWithdrawnReason(request.getReason());
        return buildFullResponse(applicationRepository.save(application));
    }

    @Override
    public ApplicationResponse toggleStar(Long applicationId, Long employerId) {
        Application application = getApplicationEntity(applicationId);
        assertEmployer(application, employerId);
        application.setIsStarred(!application.getIsStarred());
        return buildFullResponse(applicationRepository.save(application));
    }

    @Override
    public void deleteApplication(Long applicationId, Long candidateId) {
        Application application = getApplicationEntity(applicationId);
        assertCandidate(application, candidateId);
        applicationRepository.delete(application);
    }

    @Override
    public Application getApplicationEntity(Long id) {
        return applicationRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Application", id)
        );
    }

    public ApplicationResponse buildFullResponse(Application application) {
        JobResponse job = jobClient.getJobById(application.getJobId());
        CompanyResponse company = companyClient.getCompanyId(application.getCompanyId());
        UserResponse candidate = userClient.getUserById(application.getCandidateId());

        List<ApplicationNote> notes = applicationNoteRepository.findByApplicationId(application.getId());

        return ApplicationMapper.toApplicationResponse(application, notes, job,company, candidate);
    }

    private Sort buildSort(String sortBy){
        if("AI_SCORE_DSC".equals(sortBy)){
            return Sort.by(Sort.Order.desc("aiScore").with(Sort.NullHandling.NULLS_LAST) );
        }else if("AI_SCORE_ASC".equals(sortBy)){
            return Sort.by(Sort.Order.asc("aiScore").with(Sort.NullHandling.NULLS_LAST));
        }
        return Sort.by(Sort.Direction.DESC, "appliedAt");
    }

    private void assertEmployer(Application application,Long employerId) {
        if(!application.getEmployerId().equals(employerId)){
            throw new BusinessException("You are not the employer for this application");
        }
    }

    private void assertCandidate(Application application,Long candidateId) {
        if(!application.getCandidateId().equals(candidateId)){
            throw new BusinessException("You are not the candidate for this application");
        }
    }
}
