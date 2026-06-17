package com.hope.job.payload;

import com.hope.job.domain.ProficiencyLevel;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeSkillRequest {
    @NotBlank(message = "Skill name is required")
    @Size(max=100, message="Skill name must not exceed 100 characters")
    private String skillName;

    @NotNull(message = "Proficiency level is required")
    private ProficiencyLevel proficiencyLevel;

    @Min(value =0, message = "Years of experience must not be negative")
    private Integer yearsOfExperience;

    private Integer displayOrder;
}
