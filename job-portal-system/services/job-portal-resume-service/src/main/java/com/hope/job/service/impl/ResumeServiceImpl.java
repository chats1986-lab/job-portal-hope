package com.hope.job.service.impl;

import com.hope.job.dto.response.*;
import com.hope.job.exception.BusinessException;
import com.hope.job.exception.ResourceNotFoundException;
import com.hope.job.mapper.ResumeMapper;
import com.hope.job.mapper.WorkExperienceMapper;
import com.hope.job.modal.PersonalInfo;
import com.hope.job.modal.Resume;
import com.hope.job.payload.ResumeRequest;
import com.hope.job.repository.*;
import com.hope.job.service.ResumeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ResumeServiceImpl implements ResumeService {
    private final ResumeRepository resumeRepository;
    private final WorkExperienceRepository workExperienceRepository;
    private final EducationRepository educationRepository;
    private final ResumeSkillRepository resumeSkillRepository;
    private final ProjectRepository projectRepository;
    private final LanguageRepository languageRepository;

    @Override
    public ResumeResponse createResume(Long candidateId, ResumeRequest req) {

        if(Boolean.TRUE.equals(req.getIsDefault())){
            resumeRepository.findByCandidateIdAndIsDefaultTrue(candidateId)
                    .ifPresent(existing -> {
                        existing.setIsDefault(false);
                        resumeRepository.save(existing);
                    });
        }

        Resume resume = Resume.builder()
                .candidateId(candidateId)
                .title(req.getTitle())
                .template(req.getTemplate())
                .visibility(req.getVisibility())
                .isDefault(Boolean.TRUE.equals(req.getIsDefault()))
                .isActive(true)
                .build();

        Resume saved = resumeRepository.save(resume);
        return buildResumeResponse(saved);
    }

    @Override
    public ResumeResponse getResumeById(Long resumeId, Long candidateId) {
        Resume resume = getResumeEntityById(resumeId);
        assertOwner(resume, candidateId);
        return buildResumeResponse(resume);
    }

    @Override
    public List<ResumeResponse> getMyResumes(Long candidateId) {
        return resumeRepository.findByCandidateIdAndIsActiveTrue(candidateId)
                .stream()
                .map(this::buildResumeResponse)
                .toList();
    }

    @Override
    public ResumeResponse updatePersonalInfo(Long resumeId, Long candidateId, PersonalInfoResponse req) {
       Resume resume = getResumeEntityById(resumeId);
       assertOwner(resume, candidateId);
       PersonalInfo info = resume.getPersonalInfo();
       if(info == null) info = new PersonalInfo();
       if(req.getFirstName() != null) info.setFirstName(req.getFirstName());
       if(req.getLastName() != null) info.setLastName(req.getLastName());
       if(req.getEmail() != null) info.setEmail(req.getEmail());
       if(req.getPhone() != null) info.setPhone(req.getPhone());
       if(req.getHeadline() != null) info.setHeadline(req.getHeadline());
       if(req.getCity() != null) info.setCity(req.getCity());
       if(req.getCountry() != null) info.setCountry(req.getCountry());
       if(req.getGithubUrl() != null) info.setGithubUrl(req.getGithubUrl());
       if(req.getPortfolioUrl() != null) info.setPortfolioUrl(req.getPortfolioUrl());
       if(req.getWebsiteUrl() != null) info.setWebsiteUrl(req.getWebsiteUrl());
       if(req.getLinkedinUrl() != null) info.setLinkedinUrl(req.getLinkedinUrl());

       resume.setPersonalInfo(info);
       Resume updated = resumeRepository.save(resume);
        return buildResumeResponse(updated);
    }

    @Override
    public ResumeResponse updateSummary(Long resumeId, Long candidateId, String summary) {
        Resume resume = getResumeEntityById(resumeId);
        assertOwner(resume, candidateId);
        resume.setSummary(summary);
        Resume updated = resumeRepository.save(resume);
        return buildResumeResponse(updated);
    }

    @Override
    public ResumeResponse setDefaultResume(Long resumeId, Long candidateId) {
        Resume resume = getResumeEntityById(resumeId);
        assertOwner(resume, candidateId);
        resumeRepository.findByCandidateIdAndIsDefaultTrue(candidateId)
                .ifPresent(existing -> {
                    existing.setIsDefault(false);
                    resumeRepository.save(existing);
                });
        resume.setIsDefault(Boolean.TRUE.equals(resume.getIsDefault()));
        Resume updated = resumeRepository.save(resume);
        return buildResumeResponse(updated);
    }

    @Override
    public void deleteResumeById(Long resumeId, Long candidateId) {
        Resume resume = getResumeEntityById(resumeId);
        assertOwner(resume, candidateId);
        resume.setIsActive(false);
        resume.setIsDefault(false);
        resumeRepository.save(resume);
    }

    @Override
    public Resume getResumeEntityById(Long resumeId) {
        return resumeRepository.findById(resumeId).orElseThrow(
                () -> new ResourceNotFoundException("Resume", resumeId)
        );
    }

    private ResumeResponse buildResumeResponse(Resume resume) {
        Long resumeId = resume.getId();
        List<WorkExperienceResponse> workExperiences = workExperienceRepository.findByResume_IdOrderByDisplayOrderAsc(resumeId).stream()
                .map(WorkExperienceMapper::toWorkExperienceResponse).toList();
        List<EducationResponse> education = educationRepository.findByResume_IdOrderByDisplayOrderAsc(resumeId).stream().map(ResumeMapper::toEducationResponse).toList();
        List<ResumeSkillResponse> skills = resumeSkillRepository.findByResume_IdOrderByDisplayOrderAsc(resumeId).stream().map(ResumeMapper::toResumeSkillResponse).toList();
        List<ProjectResponse> projects = projectRepository.findByResume_IdOrderByDisplayOrderAsc(resumeId).stream().map(ResumeMapper::toProjectResponse).toList();
        List<LanguageResponse> languages = languageRepository.findByResume_IdOrderByDisplayOrderAsc(resumeId).stream().map(ResumeMapper::toLanguageResponse).toList();

        return ResumeMapper.toResponse(resume, workExperiences,education,skills,projects, languages );
    }

    private void assertOwner(Resume resume, Long candidateId) {
        if(!resume.getCandidateId().equals(candidateId)){
            throw new BusinessException("Resume not found with the provided candidateId");
        }
    }

}
