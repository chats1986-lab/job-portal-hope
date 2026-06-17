package com.hope.job.service.impl;

import com.hope.job.dto.response.EducationResponse;
import com.hope.job.mapper.ResumeMapper;
import com.hope.job.modal.Education;
import com.hope.job.modal.Resume;
import com.hope.job.payload.EducationRequest;
import com.hope.job.repository.EducationRepository;
import com.hope.job.service.EducationService;
import com.hope.job.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EducationServiceImpl implements EducationService {

    private final EducationRepository educationRepository;
    private final ResumeService resumeService;

    @Override
    public EducationResponse addEducation(Long resumeId, Long candidateId, EducationRequest req) throws Exception {

        Resume resume = resumeService.getResumeEntityById(resumeId);
        assertOwner(resume, candidateId);

        Education education = Education.builder()
                .resume(resume)
                .institutionName(req.getInstitutionName())
                .degree(req.getDegree())
                .fieldOfStudy(req.getFieldOfStudy())
                .grade(req.getGrade())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .isCurrentlyStudying(Boolean.TRUE.equals(req.getIsCurrentlyStudying()))
                .description(req.getDescription())
                .displayOrder(req.getDisplayOrder() != null ? req.getDisplayOrder() : 0)
                .build();
        Education saved = educationRepository.save(education);
        return ResumeMapper.toEducationResponse(saved);

    }

    @Override
    public List<EducationResponse> getEducations(Long resumeId) {
        return educationRepository.findByResume_IdOrderByDisplayOrderAsc(resumeId)
                .stream()
                .map(
                        ResumeMapper::toEducationResponse
                ).toList();
    }

    @Override
    public EducationResponse updateEducation(Long educationId, Long resumeId, Long candidateId, EducationRequest req) throws Exception {

        Education edu = educationRepository.findById(String.valueOf(educationId))
                .orElseThrow(
                        () -> new Exception("Education not found")
                );
        assertOwner(edu.getResume(), candidateId);

        edu.setInstitutionName(req.getInstitutionName());
        edu.setDegree(req.getDegree());
        edu.setFieldOfStudy(req.getFieldOfStudy());
        edu.setGrade(req.getGrade());
        edu.setStartDate(req.getStartDate());
        edu.setEndDate(req.getEndDate());
        edu.setIsCurrentlyStudying(Boolean.TRUE.equals(req.getIsCurrentlyStudying()));
        edu.setDescription(req.getDescription());
        if(req.getDisplayOrder() != null) edu.setDisplayOrder(req.getDisplayOrder());
        return ResumeMapper.toEducationResponse(educationRepository.save(edu));
    }

    @Override
    public void deleteEducation(Long educationId, Long resumeId, Long candidateId) throws Exception {
        Education edu = educationRepository.findById(String.valueOf(educationId))
                .orElseThrow(
                        () -> new Exception("Education not found")
                );
        assertOwner(edu.getResume(), candidateId);
        educationRepository.delete(edu);
    }

    private void assertOwner(Resume resume, Long candidateId) throws Exception {
        if(!resume.getCandidateId().equals(candidateId)) {
            throw new Exception("Resume not found");
        }
    }
}
