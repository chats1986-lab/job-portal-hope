package com.hope.job.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectRequest {
    @NotBlank(message = "project title is required")
    private String title;

    private String description;
    private List<String> technologies;

    @Pattern(regexp = "^(https://).*", message = "Project URL must be valid")
    private String projectUrl;

    @Pattern(regexp="^(https://).*", message="Source code URL must be valid")
    private String sourceCodeUrl;

    private LocalDate startDate;
    private LocalDate endDate;

    @Builder.Default
    private Boolean isOngoing = false;

    private Integer displayOrder;

}
