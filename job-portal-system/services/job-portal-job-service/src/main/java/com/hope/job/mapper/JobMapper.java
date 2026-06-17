package com.hope.job.mapper;

import com.hope.job.dto.response.CompanyResponse;
import com.hope.job.dto.response.JobResponse;
import com.hope.job.dto.response.JobSkillResponse;
import com.hope.job.dto.response.JobTagResponse;
import com.hope.job.modal.Job;
import com.hope.job.modal.embeddable.JobLocation;
import com.hope.job.modal.embeddable.SalaryRange;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

public class JobMapper {
    public static JobResponse toDTO(Job job, CompanyResponse companyResponse) {

        JobLocation loc = job.getLocation();
        SalaryRange sal = job.getSalaryRange();

        Set<JobSkillResponse> skills = job.getSkills() == null ? Collections.emptySet() : job.getSkills().stream().map(
                JobSkillMapper::toJobSkillResponse
        ).collect(Collectors.toSet());

        Set<JobTagResponse> tags = job.getTags() == null ? Collections.emptySet() : job.getTags().stream().map(
                JobTagMapper::toJobTagResponse
        ).collect(Collectors.toSet());

        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .responsibilities(job.getResponsibilities())
                .benefits(job.getBenefits())
                .company(companyResponse)
                .employerId(job.getEmployerId())
                .jobCategory(JobCategoryMapper.toJobCategoryResponse(job.getCategory(), false))
                .jobSkills(skills)
                .jobTags(tags)
                .address(loc != null ? loc.getAddress() : null)
                .city(loc != null ? loc.getCity() : null)
                .state(loc != null ? loc.getState() : null)
                .country(loc != null ? loc.getCountry() : null)

                // salary
                .minSalary(sal != null ? sal.getMinSalary() : null)
                .maxSalary(sal != null ? sal.getMaxSalary() : null)

                // classification
                .jobType(job.getJobType())
                .workMode(job.getWorkMode())
                .experienceLevel(job.getExperienceLevel())
                .jobStatus(job.getStatus())

                // posting
                .openings(job.getOpenings())
                .applicationDeadline(job.getApplicationDeadline())
                .expiresAt(job.getExpiresAt())
                .active(job.getActive())

                // analytics
//                .viewCount(job.getViewCount())
//                .applicationCount(job.getApplicationCount())

                // timestamp
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .publishedAt(job.getPublishedAt())
                .closedAt(job.getClosedAt())
                .build();

    }
}
