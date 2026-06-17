package com.hope.job.service.impl;

import com.hope.job.dto.response.WorkExperienceResponse;
import com.hope.job.mapper.WorkExperienceMapper;
import com.hope.job.modal.Resume;
import com.hope.job.modal.WorkExperience;
import com.hope.job.payload.WorkExperienceRequest;
import com.hope.job.repository.WorkExperienceRepository;
import com.hope.job.service.ResumeService;
import com.hope.job.service.WorkExperienceService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class WorkExperienceServiceImpl implements WorkExperienceService {
    private final ResumeService resumeService;
    private final WorkExperienceRepository workExperienceRepository;

    @Override
    public WorkExperienceResponse addWorkExperience(Long resumeId, Long candidateId, WorkExperienceRequest req) throws Exception {

        Resume resume = resumeService.getResumeEntityById(resumeId);
        assertOwner(resume, candidateId);

        WorkExperience workExperience = WorkExperience.builder()
                .resume(resume)
                .companyName(req.getCompanyName())
                .companyLogoUrl(req.getCompanyLogoUrl())
                .jobTitle(req.getJobTitle())
                .description(req.getDescription())
                .employmentType(req.getJobType())
                .location(req.getLocation())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .isCurrentJob(Boolean.TRUE.equals(req.getIsCurrentJob()))
                .technologies(req.getTechnologies() != null ? req.getTechnologies() : List.of())
                .displayOrder(req.getDisplayOrder() != null ? req.getDisplayOrder() : 0)
                .build();

        WorkExperience saved = workExperienceRepository.save(workExperience);
        return WorkExperienceMapper.toWorkExperienceResponse(saved);
    }



    @Override
    public List<WorkExperienceResponse> getWorkExperiences(Long resumeId, Long candidateId) {
      return  workExperienceRepository.findByResume_IdOrderByDisplayOrderAsc(resumeId).stream().map(
                workExperience -> WorkExperienceMapper.toWorkExperienceResponse(workExperience)
        ).collect(Collectors.toList());    }

    @Override
    public WorkExperienceResponse updateWorkExperience(Long resumeId, Long candidateId, Long workExperienceId, WorkExperienceRequest req) throws Exception {
        WorkExperience  exp = getWorkExperienceEntity(workExperienceId);
        assertOwner(exp.getResume(),  candidateId);

        exp.setCompanyName(req.getCompanyName());
        exp.setCompanyLogoUrl(req.getCompanyLogoUrl());
        exp.setJobTitle(req.getJobTitle());
        exp.setDescription(req.getDescription());
        exp.setEmploymentType(req.getJobType());
        exp.setLocation(req.getLocation());
        exp.setStartDate(req.getStartDate());
        exp.setEndDate(req.getEndDate());
        exp.setIsCurrentJob(req.getIsCurrentJob());
        if(req.getTechnologies() != null) exp.setTechnologies(req.getTechnologies());
        if(req.getDisplayOrder() != null) exp.setDisplayOrder(req.getDisplayOrder());

        WorkExperience saved = workExperienceRepository.save(exp);
        return WorkExperienceMapper.toWorkExperienceResponse(saved);
    }

    @Override
    public void deleteWorkExperience(Long resumeId, Long workExperienceId, Long candidateId) throws Exception {
        WorkExperience  exp = getWorkExperienceEntity(workExperienceId);
        assertOwner(exp.getResume(),  candidateId);
        workExperienceRepository.delete(exp);
    }

    @Override
    public WorkExperience getWorkExperienceEntity(Long workExperienceId) throws Exception {
        return workExperienceRepository.findById(workExperienceId).orElseThrow(() -> new Exception("Work experience not found"));
    }

    private void assertOwner(Resume resume, Long candidateId) throws Exception {
        if(!resume.getCandidateId().equals(candidateId)) {
            throw new Exception("Resume not found");
        }
    }


}
