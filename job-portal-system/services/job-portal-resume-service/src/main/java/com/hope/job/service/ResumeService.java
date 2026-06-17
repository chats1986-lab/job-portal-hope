package com.hope.job.service;

import com.hope.job.dto.response.PersonalInfoResponse;
import com.hope.job.dto.response.ResumeResponse;
import com.hope.job.modal.Resume;
import com.hope.job.payload.ResumeRequest;

import java.util.List;

public interface ResumeService {
    ResumeResponse createResume(Long candidateId, ResumeRequest req);

    ResumeResponse getResumeById(Long resumeId, Long candidateId);

    List<ResumeResponse> getMyResumes(Long candidateId);
    ResumeResponse updatePersonalInfo(Long resumeId, Long candidateId, PersonalInfoResponse req);

    ResumeResponse updateSummary(Long resumeId, Long candidateId, String summary);

    ResumeResponse setDefaultResume(Long resumeId, Long candidateId);

    void deleteResumeById(Long resumeId, Long candidateId);

    Resume getResumeEntityById(Long resumeId);
}
