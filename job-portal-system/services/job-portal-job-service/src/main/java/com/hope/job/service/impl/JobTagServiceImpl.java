package com.hope.job.service.impl;

import com.hope.job.dto.response.JobTagResponse;
import com.hope.job.exception.BusinessException;
import com.hope.job.exception.ResourceNotFoundException;
import com.hope.job.mapper.JobTagMapper;
import com.hope.job.modal.JobTag;
import com.hope.job.payload.JobTagRequest;
import com.hope.job.repository.JobTagRepository;
import com.hope.job.service.JobTagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class JobTagServiceImpl implements JobTagService {

    private final JobTagRepository jobTagRepository;

    @Override
    public JobTagResponse createJobTag(JobTagRequest req) {

        if(jobTagRepository.existsByName(req.getName())
        ){
            throw new BusinessException("Job tag name already exists");
        }

        String slug = generateUniqueSlug(req.getName());
        JobTag jobTag = JobTag.builder()
                .name(req.getName())
                .slug(slug)
                .build();

        JobTag saved = jobTagRepository.save(jobTag);
        return JobTagMapper.toJobTagResponse(saved);
    }

    private String generateUniqueSlug(String name) {
        String base = name.toLowerCase()
                .replaceAll("[^a-zA-Z0-9]", "").trim().replaceAll("-", "");
        if(!jobTagRepository.existsBySlug(base)) {
            return base;
        }

        int counter = 1;
        while(jobTagRepository.existsBySlug(base+"-"+counter)) {
            counter++;
        }
        return base+"-"+counter;

    }

    @Override
    public List<JobTagResponse> getAllJobTags() {
        return jobTagRepository.findAll()
                .stream()
                .map(JobTagMapper::toJobTagResponse)
                .collect(Collectors.toList());
    }

    @Override
    public JobTagResponse getJobTagById(Long id) {
        JobTag jobTag = getJobTagEntityById(id);
        return JobTagMapper.toJobTagResponse(jobTag);
    }

    @Override
    public JobTagResponse updateJobTag(Long id, JobTagRequest req) {
        JobTag jobTag = getJobTagEntityById(id);

        if(!jobTag.getName().equals(req.getName())
        && jobTagRepository.existsByName(req.getName())
        ){
            throw new BusinessException("Job tag name already exists");
        }
        jobTag.setName(req.getName());
        return JobTagMapper.toJobTagResponse(jobTagRepository.save(jobTag));
    }

    @Override
    public void deleteJobTagById(Long id) {
        JobTag jobTag = getJobTagEntityById(id);
        jobTagRepository.delete(jobTag);
    }

    @Override
    public JobTag getJobTagEntityById(Long id) {
        return jobTagRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("JobTag", id)
        );
    }

    @Override
    public Set<JobTag> getTagsByIds(Set<Long> ids) {
        List<JobTag> tags = jobTagRepository.findAllById(ids);
        return new HashSet<>(tags);
    }
}
