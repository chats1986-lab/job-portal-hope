package com.hope.job.service.impl;

import com.hope.job.dto.response.JobSkillResponse;
import com.hope.job.exception.BusinessException;
import com.hope.job.exception.ResourceNotFoundException;
import com.hope.job.mapper.JobSkillMapper;
import com.hope.job.modal.JobSkill;
import com.hope.job.payload.JobSkillRequest;
import com.hope.job.repository.JobSkillRepository;
import com.hope.job.service.JobSkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobSkillServiceImpl implements JobSkillService {

    private final JobSkillRepository jobSkillRepository;

    @Override
    public JobSkillResponse createSkill(JobSkillRequest req) {
        if(jobSkillRepository.existsByName(req.getName())){
            throw new BusinessException("Skills name already exists");
        }
        String slug = generateUniqueSlug(req.getName());
        JobSkill skill = JobSkill.builder()
                .name(req.getName())
                .slug(slug)
                .category(req.getCategory())
                .active(true)
                .build();
        JobSkill savedSkill = jobSkillRepository.save(skill);

        return JobSkillMapper.toJobSkillResponse(savedSkill);
    }

    private String generateUniqueSlug(String name) {
        String base = name.toLowerCase()
                .replaceAll("[^a-zA-Z0-9]", "").trim().replaceAll("-", "");
        if(!jobSkillRepository.existsBySlug(base)) {
            return base;
        }

        int counter = 1;
        while(jobSkillRepository.existsBySlug(base+"-"+counter)) {
            counter++;
        }
        return base+"-"+counter;

    }

    @Override
    public List<JobSkillResponse> getAllSkills() {
        return jobSkillRepository.findByActiveTrue()
                .stream()
                .map(
                        JobSkillMapper::toJobSkillResponse
                ).collect(Collectors.toList());
    }

    @Override
    public JobSkillResponse getSkillById(Long id) {
        JobSkill skill = jobSkillRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("JobSkill", id)
        );
        return JobSkillMapper.toJobSkillResponse(skill);
    }

    @Override
    public JobSkillResponse updateSkill(Long id, JobSkillRequest req) {
        JobSkill skill = jobSkillRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("JobSkill", id)
        );
        if(!skill.getName().equals(req.getName())
        && jobSkillRepository.existsByName(req.getName())
        ){
            throw new BusinessException("Skills name already exists");
        }
        skill.setName(req.getName());
        skill.setCategory(req.getCategory());
        return JobSkillMapper.toJobSkillResponse(jobSkillRepository.save(skill));
    }

    @Override
    public void deleteSkillById(Long id) {
        JobSkill skill = jobSkillRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("JobSkill", id)
        );
        skill.setActive(false);
        jobSkillRepository.save(skill);
    }

    @Override
    public Set<JobSkill> getSkillByIds(Set<Long> ids) {
        Set<JobSkill> jobSkills = new HashSet<>(jobSkillRepository.findAllById(ids));
        return jobSkills;
    }
}
