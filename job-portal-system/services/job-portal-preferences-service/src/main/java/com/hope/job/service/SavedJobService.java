package com.hope.job.service;

import com.hope.job.dto.response.SavedJobResponse;
import com.hope.job.payload.SavedJobRequest;

import java.util.List;

public interface SavedJobService {
    SavedJobResponse saveJob(Long candidateId, SavedJobRequest req) throws Exception;
    void unsaveJob(Long candidateId, Long jobId) throws Exception;
    List<SavedJobResponse> getSavedJobs(Long candidateId);
    boolean isSaved(Long candidateId, Long jobId);

}
