package com.hope.job.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeSummaryRequest {

    @NotBlank(message="Target Job Title is required")
    private String targetJobTitle;

    @NotEmpty(message="Work Experience")
    private List<WorkExperienceInfo> workExperiences;

    private List<String> skills;

    private List<EducationInfo> educations;

    private Integer yearOfExperience;

    @Data
    public static class WorkExperienceInfo{
        private String jobTitle;
        private String company;
        private String description;
    }

    @Data
    public static class EducationInfo{
        private String degree;
        private String fieldOfStudy;
        private String institutionName;
    }
}
