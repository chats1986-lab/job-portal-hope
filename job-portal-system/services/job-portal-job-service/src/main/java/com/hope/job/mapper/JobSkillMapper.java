package com.hope.job.mapper;

import com.hope.job.dto.response.JobSkillResponse;
import com.hope.job.modal.JobSkill;

public class JobSkillMapper {
    public static JobSkillResponse toJobSkillResponse(JobSkill jobSkill) {
       return JobSkillResponse.builder()
                .id(jobSkill.getId())
                .skillName(jobSkill.getName())
                .slug(jobSkill.getSlug())
                .skillCategory(jobSkill.getCategory())
                .active(jobSkill.getActive())
                .build();
    }
}
