package com.hope.job.dto.response;

import com.hope.job.domain.ResumeTemplate;
import com.hope.job.domain.ResumeVisibility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ResumeResponse {
    private Long id;
    private Long candidateId;
    private String title;
    private ResumeTemplate resumeTemplate;
    private ResumeVisibility resumeVisibility;
    private Boolean isDefault;
    private PersonalInfoResponse personalInfo;

    private String summary;
//    private String uploadedFileUrl;
//    private String uploadedFileName;
    private Integer completionScore;
//    private Boolean active;
    private LocalDateTime lastViewedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<WorkExperienceResponse> workExperiences;
    private List<EducationResponse> educations;
    private List<ResumeSkillResponse> skills;
    private List<ProjectResponse> projects;
//    private List<CertificateResponse> certifications;
//    private List<AwardResponse> awards;
    private List<LanguageResponse> languages;

}
