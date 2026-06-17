package com.hope.job.service;

import com.hope.job.dto.request.JobRequest;
import com.hope.job.dto.response.JobResponse;
import com.hope.job.payload.JobSearchRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface JobService {
    JobResponse createJob(Long employerId, JobRequest req);

    JobResponse getJobById(Long id);
    Page<JobResponse> getJobList(JobSearchRequest req);
    List<JobResponse> getJobsByCompany(Long companyId);

    JobResponse updateJob(Long jobId, Long employerId, JobRequest req);
    JobResponse publishJob(Long jobId, Long employerId);
    JobResponse closeJob(Long jobId, Long employerId);
    void deleteJob(Long jobId, Long employerId);

    List<JobResponse> getAllJobsAdmin();

}
