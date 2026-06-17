package com.hope.job.mapper;

import com.hope.job.dto.response.*;
import com.hope.job.modal.*;

import java.util.List;

public class ResumeMapper {

    public static PersonalInfoResponse toPersonalInfoResponse(PersonalInfo info){
       if(info == null) return null;

       return PersonalInfoResponse.builder()
                .firstName(info.getFirstName())
                .lastName(info.getLastName())
                .email(info.getEmail())
                .phone(info.getPhone())
                .headline(info.getHeadline())
                .city(info.getCity())
                .country(info.getCountry())
                .linkedinUrl(info.getLinkedinUrl())
                .githubUrl(info.getGithubUrl())
                .portfolioUrl(info.getPortfolioUrl())
                .websiteUrl(info.getWebsiteUrl())
                .build();
    }
    public static ResumeResponse toResponse(
            Resume resume,
            List<WorkExperienceResponse> workExperiences,
            List<EducationResponse> educations,
            List<ResumeSkillResponse> skills,
            List<ProjectResponse> projects,
            List<LanguageResponse> languages
            ) {
        if(resume == null) {
            return null;
        }

        return ResumeResponse.builder()
                .id(resume.getId())
                .candidateId(resume.getCandidateId())
                .title(resume.getTitle())
                .resumeTemplate(resume.getTemplate())
                .resumeVisibility(resume.getVisibility())
                .isDefault(resume.getIsDefault())
                .personalInfo(ResumeMapper.toPersonalInfoResponse(resume.getPersonalInfo()))
                .summary(resume.getSummary())
                .completionScore(resume.getCompletionScore())
                .createdAt(resume.getCreatedAt())
                .updatedAt(resume.getUpdatedAt())
                .workExperiences(workExperiences)
                .educations(educations)
                .skills(skills)
                .projects(projects)
                .languages(languages)
                .build();
    }

    public static ResumeSkillResponse toResumeSkillResponse(ResumeSkill skill) {
        if(skill == null) {
            return null;
        }

      return  ResumeSkillResponse.builder()
              .id(skill.getId())
              .skillName(skill.getSkillName())
              .proficiencyLevel(skill.getProficiencyLevel())
              .yearsOfExperience(skill.getYearsOfExperience())
              .displayOrder(skill.getDisplayOrder())
              .build();
    }

    public static EducationResponse toEducationResponse(Education education) {
        if(education == null) return null;
        return EducationResponse.builder()
                .id(education.getId())
                .institutionName(education.getInstitutionName())
                .degree(education.getDegree())
                .grade(education.getGrade())
                .fieldOfStudy(education.getFieldOfStudy())
                .startDate(education.getStartDate())
                .endDate(education.getEndDate())
                .isCurrentlyStudying(education.getIsCurrentlyStudying())
                .description(education.getDescription())
                .displayOrder(education.getDisplayOrder())
                .build();
    }

    public static ProjectResponse toProjectResponse(Project project) {
        if(project == null) return null;
        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .technologies(project.getTechnologies())
                .projectUrl(project.getProjectUrl())
                .sourceCodeUrl(project.getSourceCodeUrl())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .isOngoing(project.getIsOngoing())
                .displayOrder(project.getDisplayOrder())
                .build();
    }

    public static LanguageResponse toLanguageResponse(Language language) {
        if(language == null) return null;
        return LanguageResponse.builder()
                .id(language.getId())
                .languageName(language.getLanguageName())
                .languageProficiency(language.getLanguageProficiency())
                .displayOrder(language.getDisplayOrder())
                .build();
    }
}
