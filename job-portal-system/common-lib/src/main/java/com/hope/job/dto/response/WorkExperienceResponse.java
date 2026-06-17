package com.hope.job.dto.response;

import com.hope.job.domain.JobType;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkExperienceResponse {
    private Long id;
    private String companyName;
    private String companyLogoUrl;
    private String jobTitle;
    private JobType employmentType;
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;
    @Builder.Default
    private Boolean isCurrentJob=false;
    private String description;
    @Builder.Default
    private List<String> technologies = new ArrayList<>();
    @Builder.Default
    private Integer displayOrder =0;

}
