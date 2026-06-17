package com.hope.job.payload;

import com.hope.job.domain.ExperienceLevel;
import com.hope.job.domain.JobStatus;
import com.hope.job.domain.JobType;
import com.hope.job.domain.WorkMode;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobSearchRequest {

    private String query;
    private Long categoryId;
    private List<Long> skillIds;

    private List<Long> tagIds;
    private Long companyId;
    private String location;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;
    private JobType jobType;
    private WorkMode workMode;
    private ExperienceLevel experienceLevel;
    private JobStatus jobStatus;

    private Integer minOpenings;
    private Integer maxOpenings;

    @Builder.Default
    private Integer page = 0;
    @Builder.Default
    private Integer size = 10;
}
