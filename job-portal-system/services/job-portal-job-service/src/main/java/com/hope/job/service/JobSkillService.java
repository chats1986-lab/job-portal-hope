package com.hope.job.service;

import com.hope.job.dto.response.JobSkillResponse;
import com.hope.job.modal.JobSkill;
import com.hope.job.payload.JobSkillRequest;

import java.util.List;
import java.util.Set;

public interface JobSkillService {
    JobSkillResponse createSkill(JobSkillRequest req);
    List<JobSkillResponse> getAllSkills();

    JobSkillResponse getSkillById(Long id);
    JobSkillResponse updateSkill(Long id, JobSkillRequest req);
    void deleteSkillById(Long id);

    Set<JobSkill>  getSkillByIds(Set<Long> ids);
}
