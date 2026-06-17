package com.hope.job.mapper;

import com.hope.job.dto.response.SavedJobResponse;
import com.hope.job.modal.SavedJob;

public class PreferenceMapper {
    public static SavedJobResponse toSavedJobResponse(SavedJob savedJob) {
        return SavedJobResponse.builder()
                .id(savedJob.getId())
                .jobId(savedJob.getJobId())
                .candidateId(savedJob.getCandidateId())
                .savedAt(savedJob.getSavedAt())
                .build();
    }
}
