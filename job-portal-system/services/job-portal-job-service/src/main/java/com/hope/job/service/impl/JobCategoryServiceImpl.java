package com.hope.job.service.impl;

import com.hope.job.dto.response.JobCategoryResponse;
import com.hope.job.exception.BusinessException;
import com.hope.job.exception.ResourceNotFoundException;
import com.hope.job.mapper.JobCategoryMapper;
import com.hope.job.modal.JobCategory;
import com.hope.job.payload.JobCategoryRequest;
import com.hope.job.repository.JobCategoryRepository;
import com.hope.job.service.JobCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobCategoryServiceImpl implements JobCategoryService {

    private final JobCategoryRepository jobCategoryRepository;

    @Override
    public JobCategoryResponse createCategory(JobCategoryRequest req) {

        if(jobCategoryRepository.existsByName(req.getName())){
            throw new BusinessException("Category name already exists, kindly use a different name");
        }

        JobCategory parent=null;
        if(req.getParentId() != null){
            parent= getCategoryEntityById(req.getParentId());
        }

        String slug = generateUniqueSlug(req.getName());
        JobCategory category = JobCategory.builder()
                .name(req.getName())
                .slug(slug)
                .description(req.getDescription())
                .iconUrl(req.getIconUrl())
                .parent(parent)
                .active(true)
                .build();

        JobCategory saved = jobCategoryRepository.save(category);
        return JobCategoryMapper.toJobCategoryResponse(saved, true);
    }

    private String generateUniqueSlug(String name) {
        String base = name.toLowerCase()
                .replaceAll("[^a-zA-Z0-9]", "").trim().replaceAll("-", "");
        if(!jobCategoryRepository.existsBySlug(base)) {
            return base;
        }

        int counter = 1;
        while(jobCategoryRepository.existsBySlug(base+"-"+counter)) {
            counter++;
        }
        return base+"-"+counter;

    }

    @Override
    public List<JobCategoryResponse> getAllCategories() {


        return jobCategoryRepository
                .findByActiveTrue()
                .stream()
                .map(
                        c -> JobCategoryMapper.toJobCategoryResponse(c, false)
                ).collect(Collectors.toList());
    }

    @Override
    public JobCategoryResponse getCategoryById(Long id) {
        JobCategory jobCategory = getCategoryEntityById(id);
        return JobCategoryMapper.toJobCategoryResponse(jobCategory, true);
    }

    @Override
    public JobCategoryResponse updateCategory(Long id, JobCategoryRequest req) {
        JobCategory category = getCategoryEntityById(id);
        if(!category.getName().equals(req.getName())
        && jobCategoryRepository.existsByName(category.getName())
        ) {
            throw new BusinessException("Category name already exists, kindly use a different name");
        }

        JobCategory parent=null;
        if(req.getParentId() != null){
            if(req.getParentId().equals(id)){
                throw new BusinessException("A category cannot be its own parent");
            }
            parent = getCategoryEntityById(req.getParentId());
        }

        category.setName(req.getName());
        category.setDescription(req.getDescription());
        category.setIconUrl(req.getIconUrl());
        category.setParent(parent);

        JobCategory updated = jobCategoryRepository.save(category);
        return JobCategoryMapper.toJobCategoryResponse(updated, true);
    }

    @Override
    public void deleteCategory(Long id) {
        JobCategory category = getCategoryEntityById(id);
        category.setActive(false);
        jobCategoryRepository.save(category);
    }

    @Override
    public JobCategory getCategoryEntityById(Long id) {

        return jobCategoryRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("JobCategory", id)
        );
    }
}
