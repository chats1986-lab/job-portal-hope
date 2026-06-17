package com.hope.job.service.impl;

import com.hope.job.dto.response.ResumeSkillResponse;
import com.hope.job.mapper.ResumeMapper;
import com.hope.job.modal.Resume;
import com.hope.job.modal.ResumeSkill;
import com.hope.job.payload.ResumeSkillRequest;
import com.hope.job.repository.ResumeSkillRepository;
import com.hope.job.service.ResumeService;
import com.hope.job.service.ResumeSkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResumeSkillServiceImpl implements ResumeSkillService {

    private final ResumeService resumeService;
    private final ResumeSkillRepository resumeSkillRepository;

    @Override
    public ResumeSkillResponse addSkill(Long resumeId, Long candidateId, ResumeSkillRequest req) throws Exception {

        Resume resume = resumeService.getResumeEntityById(resumeId);
        assertOwner(resume, candidateId);

        ResumeSkill resumeSkill = ResumeSkill.builder()
                .resume(resume)
                .skillName(req.getSkillName())
                .proficiencyLevel(req.getProficiencyLevel())
                .yearsOfExperience(req.getYearsOfExperience())
                .displayOrder(req.getDisplayOrder() != null ? req.getDisplayOrder() : 0)
                .build();
        ResumeSkill saved =  resumeSkillRepository.save(resumeSkill);

        return ResumeMapper.toResumeSkillResponse(saved);
    }

    @Override
    public List<ResumeSkillResponse> getSkills(Long resumeId) {
        return resumeSkillRepository.findByResume_IdOrderByDisplayOrderAsc(resumeId).stream().map(
                ResumeMapper::toResumeSkillResponse
        ).toList();
    }

    @Override
    public ResumeSkillResponse updateSkill(Long skillId, Long resumeId, Long candidateId, ResumeSkillRequest req) throws Exception {

        ResumeSkill skill = resumeSkillRepository.findById(skillId).orElseThrow(
                () -> new Exception("Skill not found")
        );
        assertOwner(skill.getResume(), candidateId);

        skill.setSkillName(req.getSkillName());
        skill.setProficiencyLevel(req.getProficiencyLevel());
        skill.setYearsOfExperience(req.getYearsOfExperience());
        skill.setDisplayOrder(req.getDisplayOrder() != null ? req.getDisplayOrder() : 0);
        return ResumeMapper.toResumeSkillResponse(resumeSkillRepository.save(skill));
    }

    @Override
    public void deleteSkill(Long skillId, Long resumeId, Long candidateId) throws Exception {
        ResumeSkill skill = resumeSkillRepository.findById(skillId).orElseThrow(
                () -> new Exception("Skill not found")
        );
        assertOwner(skill.getResume(), candidateId);

        resumeSkillRepository.delete(skill);

    }

    private void assertOwner(Resume resume, Long candidateId) throws Exception {
        if(!resume.getCandidateId().equals(candidateId)) {
            throw new Exception("Resume not found");
        }
    }

}
