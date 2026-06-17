package com.hope.job.service.impl;

import com.hope.job.dto.response.JobResponse;
import com.hope.job.modal.Job;
import com.hope.job.modal.SavedJob;
import com.hope.job.modal.embeddable.JobLocation;
import com.hope.job.modal.embeddable.SalaryRange;
import com.hope.job.repository.JobRepository;
import com.hope.job.repository.SavedJobRepository;
import com.hope.job.service.SavedJobService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class SavedJobServiceImpl implements SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;

    @Override
    public void saveJob(Long userId, Long jobId) {
        if(savedJobRepository.existsByUserIdAndJobId(userId, jobId)) {
            throw new RuntimeException("Job already saved");
        }
        if(!jobRepository.existsById(jobId)) {
            throw new RuntimeException("Job not found");
        }
        SavedJob savedJob = SavedJob.builder()
            .userId(userId)
            .jobId(jobId)
            .build();
        savedJobRepository.save(savedJob);
    }

    @Override
    public void unsaveJob(Long userId, Long jobId) {
        savedJobRepository.deleteByUserIdAndJobId(userId, jobId);
    }

    @Override
    public boolean isJobSaved(Long userId, Long jobId) {
        return savedJobRepository.existsByUserIdAndJobId(userId, jobId);
    }

    @Override
    public List<JobResponse> getSavedJobs(Long userId) {
        List<SavedJob> savedJobs = savedJobRepository.findByUserIdOrderBySavedAtDesc(userId);
        
        return savedJobs.stream()
                .map(saved -> jobRepository.findById(saved.getJobId())
                        .orElse(null))
                .filter(job -> job != null)
                .map(this::mapToJobResponse)
                .collect(Collectors.toList());
    }

    private JobResponse mapToJobResponse(Job job) {
        JobLocation loc = job.getLocation();
        SalaryRange sal = job.getSalaryRange();
        
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .responsibilities(job.getResponsibilities())
                .benefits(job.getBenefits())
                .company(null)
                .employerId(job.getEmployerId())
                .address(loc != null ? loc.getAddress() : null)
                .city(loc != null ? loc.getCity() : null)
                .state(loc != null ? loc.getState() : null)
                .country(loc != null ? loc.getCountry() : null)
                .zipCode(loc != null ? loc.getZipcode() : null)
                .minSalary(sal != null ? sal.getMinSalary() : null)
                .maxSalary(sal != null ? sal.getMaxSalary() : null)
                .jobType(job.getJobType())
                .workMode(job.getWorkMode())
                .experienceLevel(job.getExperienceLevel())
                .jobStatus(job.getStatus())
                .openings(job.getOpenings())
                .applicationDeadline(job.getApplicationDeadline())
                .expiresAt(job.getExpiresAt())
                .active(job.getActive())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .publishedAt(job.getPublishedAt())
                .closedAt(job.getClosedAt())
                .build();
    }

}
