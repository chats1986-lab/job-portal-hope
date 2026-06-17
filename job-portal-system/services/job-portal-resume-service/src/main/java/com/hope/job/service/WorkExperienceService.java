package com.hope.job.service;

import com.hope.job.dto.response.WorkExperienceResponse;
import com.hope.job.modal.WorkExperience;
import com.hope.job.payload.WorkExperienceRequest;

import java.util.List;

public interface WorkExperienceService {
    WorkExperienceResponse addWorkExperience(Long resumeId, Long candidateId, WorkExperienceRequest req) throws Exception;

    List<WorkExperienceResponse> getWorkExperiences(Long resumeId, Long candidateId);

    WorkExperienceResponse updateWorkExperience(Long resumeId, Long candidateId, Long workExperienceId, WorkExperienceRequest req) throws Exception;

    void deleteWorkExperience(Long resumeId, Long workExperienceId, Long candidateId) throws Exception;

    WorkExperience getWorkExperienceEntity(Long workExperienceId) throws Exception;
}
