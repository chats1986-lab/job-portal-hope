package com.hope.job.service;

import java.util.List;

import com.hope.job.dto.response.JobResponse;

public interface SavedJobService {
    void saveJob(Long userId, Long jobId);
    void unsaveJob(Long userId, Long jobId);
    List<JobResponse> getSavedJobs(Long userId);
    boolean isJobSaved(Long userId, Long jobId);

}
