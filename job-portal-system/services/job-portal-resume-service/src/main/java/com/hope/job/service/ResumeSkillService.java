package com.hope.job.service;

import com.hope.job.dto.response.ResumeSkillResponse;
import com.hope.job.payload.ResumeSkillRequest;

import java.util.List;

public interface ResumeSkillService {
    ResumeSkillResponse addSkill(Long resumeId, Long candidateId, ResumeSkillRequest req) throws Exception;

    List<ResumeSkillResponse> getSkills(Long resumeId);

    ResumeSkillResponse updateSkill(Long skillId, Long resumeId, Long candidateId, ResumeSkillRequest req) throws Exception;

    void deleteSkill(Long skillid, Long resumeId, Long candidateId) throws Exception;
}
