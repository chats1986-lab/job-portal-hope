package com.hope.job.service;

import com.hope.job.dto.response.EducationResponse;
import com.hope.job.payload.EducationRequest;

import java.util.List;

public interface EducationService {

    EducationResponse addEducation(Long resumeId, Long candidateId, EducationRequest req) throws Exception;
    List<EducationResponse> getEducations(Long resumeId);

    EducationResponse updateEducation(Long educationId, Long resumeId, Long candidateId, EducationRequest req) throws Exception;

    void deleteEducation(Long educationId, Long resumeId, Long candidateId) throws Exception;
}
