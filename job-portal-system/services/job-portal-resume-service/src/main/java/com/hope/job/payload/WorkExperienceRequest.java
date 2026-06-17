package com.hope.job.payload;

import com.hope.job.domain.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkExperienceRequest {

    @NotBlank(message="Company name is required")
    private String companyName;

    private String companyLogoUrl;

    @NotBlank(message="Job title is required")
    private String jobTitle;

    private JobType jobType;
    private String location;

    @NotNull(message="Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;

    @Builder.Default
    private Boolean isCurrentJob = false;

    private String description;
    private List<String> technologies;
    private Integer displayOrder;


}
