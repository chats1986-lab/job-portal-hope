package com.hope.job.mapper;

import com.hope.job.dto.response.WorkExperienceResponse;
import com.hope.job.modal.WorkExperience;

public class WorkExperienceMapper {
    public static WorkExperienceResponse toWorkExperienceResponse(WorkExperience experience) {
        if(experience == null){
            return null;
        }
        return WorkExperienceResponse.builder()
                .id(Long.valueOf(experience.getId()))
                .companyName(experience.getCompanyName())
                .companyLogoUrl(experience.getCompanyLogoUrl())
                .jobTitle(experience.getJobTitle())
                .employmentType(experience.getEmploymentType())
                .location(experience.getLocation())
                .startDate(experience.getStartDate())
                .endDate(experience.getEndDate())
                .isCurrentJob(experience.getIsCurrentJob())
                .description(experience.getDescription())
                .technologies(experience.getTechnologies())
                .displayOrder(experience.getDisplayOrder())
                .build();
    }
}
