package com.hope.job.service.impl;

import com.hope.job.client.CompanyClient;
import com.hope.job.domain.JobStatus;
import com.hope.job.dto.request.JobRequest;
import com.hope.job.dto.response.CompanyResponse;
import com.hope.job.dto.response.JobResponse;
import com.hope.job.exception.BusinessException;
import com.hope.job.exception.ResourceNotFoundException;
import com.hope.job.mapper.JobMapper;
import com.hope.job.modal.Job;
import com.hope.job.modal.JobCategory;
import com.hope.job.modal.JobSkill;
import com.hope.job.modal.JobTag;
import com.hope.job.modal.embeddable.JobLocation;
import com.hope.job.modal.embeddable.SalaryRange;
import com.hope.job.payload.JobSearchRequest;
import com.hope.job.repository.JobRepository;
import com.hope.job.repository.JobSpecification;
import com.hope.job.service.JobCategoryService;
import com.hope.job.service.JobService;
import com.hope.job.service.JobSkillService;
import com.hope.job.service.JobTagService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final JobCategoryService jobCategoryService;
    private final JobSkillService jobSkillService;
    private final JobTagService jobTagService;
    private final CompanyClient companyClient;

    @Override
    public JobResponse createJob(Long employerId, JobRequest req) {

        JobCategory category = jobCategoryService.getCategoryEntityById(req.getCategoryId());

        Set<JobSkill> skills = req.getSkillIds() != null ? jobSkillService.getSkillByIds(req.getSkillIds()) : Collections.emptySet();

        Set<JobTag> tags = req.getTagIds() != null ?
                jobTagService.getTagsByIds(req.getTagIds()) : Collections.emptySet();

        CompanyResponse company = companyClient.getMyCompany(employerId);

        Job job = Job.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .requirements(req.getRequirements())
                .responsibilities(req.getResponsibilities())
                .benefits(req.getBenefits())
                .companyId(company.getId())
                .employerId(employerId)
                .category(category)
                .skills(skills)
                .tags(tags)
                .location(buildLocation(req))
                .salaryRange(buildSalaryRange(req))
                .jobType(req.getJobType())
                .workMode(req.getWorkMode())
                .experienceLevel(req.getExperienceLevel())
                .openings(req.getOpenings() != null ? req.getOpenings() : 1)
                .applicationDeadline(req.getApplicationDeadline())
                .expiresAt(req.getExpiresAt())
                .active(true)
                .status(JobStatus.DRAFT)
                .build();

        Job savedJob = jobRepository.save(job);
        return convertToResponse(savedJob);

    }

    private JobResponse convertToResponse(Job savedJobs){
        CompanyResponse companyResponse = companyClient.getCompanyId(savedJobs.getCompanyId());
        return JobMapper.toDTO(savedJobs, companyResponse);
    }

    private SalaryRange buildSalaryRange(JobRequest req) {
        return SalaryRange.builder()
                .minSalary(req.getMinSalary())
                .maxSalary(req.getMaxSalary())
                .build();
    }

    private JobLocation buildLocation(JobRequest req) {
        return JobLocation.builder()
                .address(req.getAddress())
                .city(req.getCity())
                .state(req.getState())
                .country(req.getCountry())
                .zipcode(req.getZipCode())
                .build();
    }

    @Override
    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Job", id)
        );
        return convertToResponse(job);
    }

    @Override
    public Page<JobResponse> getJobList(JobSearchRequest req) {
        Pageable pageable = PageRequest.of(
                req.getPage() != null ? req.getPage() : 0,
                req.getSize() != null ? req.getSize() : 10,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
        Page<Job> jobs = jobRepository.findAll(JobSpecification.build(req), pageable);
        return jobs.map(this::convertToResponse);
    }

    @Override
    public List<JobResponse> getJobsByCompany(Long companyId) {

        List<Job> jobs = jobRepository.findByCompanyId(companyId);
        return jobs.stream().map(
                this::convertToResponse
        ).collect(Collectors.toList());

    }

    @Override
    public JobResponse updateJob(Long jobId, Long employerId, JobRequest req) {
        Job job = jobRepository.findById(jobId).orElseThrow(
                () -> new ResourceNotFoundException("Job", jobId)
        );
        assertEmployer(job, employerId);

        JobCategory category = jobCategoryService.getCategoryEntityById(req.getCategoryId());

        Set<JobSkill> skills = req.getSkillIds() != null ? jobSkillService.getSkillByIds(req.getSkillIds()) : Collections.emptySet();

        Set<JobTag> tags = req.getTagIds() != null ?
                jobTagService.getTagsByIds(req.getTagIds()) : Collections.emptySet();


        job.setTitle(req.getTitle());
        job.setDescription(req.getDescription());
        job.setRequirements(req.getRequirements());
        job.setResponsibilities(req.getResponsibilities());
        job.setBenefits(req.getBenefits());
        job.setCategory(category);
        job.setSkills(skills);
        job.setTags(tags);
        job.setLocation(buildLocation(req));
        job.setSalaryRange(buildSalaryRange(req));
        job.setJobType(req.getJobType());
        job.setWorkMode(req.getWorkMode());
        job.setExperienceLevel(req.getExperienceLevel());
        job.setOpenings(req.getOpenings() != null ? req.getOpenings() : 1);
        job.setApplicationDeadline(req.getApplicationDeadline());
        job.setExpiresAt(req.getExpiresAt());

        return convertToResponse(jobRepository.save(job));
    }

    @Override
    public JobResponse publishJob(Long jobId, Long employerId) {
        Job job = jobRepository.findById(jobId).orElseThrow(
                () -> new ResourceNotFoundException("Job", jobId)
        );

        assertEmployer(job, employerId);

        if(job.getStatus() == JobStatus.CLOSED || job.getStatus() == JobStatus.EXPIRED) {
            throw new BusinessException("Job has been closed");
        }

        job.setStatus(JobStatus.OPEN);
        job.setPublishedAt(LocalDateTime.now());
        job.setActive(true);
        return convertToResponse(jobRepository.save(job));

    }


    @Override
    public JobResponse closeJob(Long jobId, Long employerId) {

        Job job = jobRepository.findById(jobId).orElseThrow(
                () ->  new ResourceNotFoundException("Job", jobId)
        );
        assertEmployer(job, employerId);
        job.setStatus(JobStatus.CLOSED);
        job.setClosedAt(LocalDateTime.now());
        job.setActive(false);
        return convertToResponse(jobRepository.save(job));
    }

    @Override
    public void deleteJob(Long jobId, Long employerId) {
        Job job = jobRepository.findById(jobId).orElseThrow(
                () -> new ResourceNotFoundException("Job", jobId)
        );
        assertEmployer(job, employerId);
       jobRepository.deleteById(jobId);
    }

    @Override
    public List<JobResponse> getAllJobsAdmin() {
        return
                jobRepository.findAll().stream().map(
                        this::convertToResponse
                ).collect(Collectors.toList());
    }

    private void assertEmployer(Job job, Long employerId) {
        if(!job.getEmployerId().equals(employerId)){
            throw new BusinessException("You are not the employer who posted this job");
        }
    }

}
