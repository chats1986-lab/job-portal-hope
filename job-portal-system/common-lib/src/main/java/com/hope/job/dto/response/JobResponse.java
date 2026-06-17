package com.hope.job.dto.response;

import com.hope.job.domain.ExperienceLevel;
import com.hope.job.domain.JobStatus;
import com.hope.job.domain.JobType;
import com.hope.job.domain.WorkMode;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobResponse {

    private Long id;
    private String title;
    private String description;
    private String requirements;
    private String responsibilities;
    private String benefits;

    private CompanyResponse company;
    private Long employerId;

    private JobCategoryResponse jobCategory;
    private Set<JobSkillResponse> jobSkills;
    private Set<JobTagResponse> jobTags;

    //Location
    private String address;
    private String city;
    private String state;
    private String country;
    private String zipCode;

    //Salary
    private BigDecimal minSalary;
    private BigDecimal maxSalary;

    //Classification
    private JobType jobType;
    private WorkMode workMode;
    private ExperienceLevel experienceLevel;
    private JobStatus jobStatus;

    // Posting details
    private Integer openings;
    private LocalDate applicationDeadline;
    private LocalDate expiresAt;
    private Boolean active;

    //Analytics
    private Long viewCount;
    private Long applicationCount;

    //Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
    private LocalDateTime closedAt;



}
