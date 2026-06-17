package com.hope.job.service;

import com.hope.job.dto.response.JobCategoryResponse;
import com.hope.job.modal.JobCategory;
import com.hope.job.payload.JobCategoryRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface JobCategoryService {
    JobCategoryResponse createCategory(JobCategoryRequest req);
    List<JobCategoryResponse> getAllCategories();
    JobCategoryResponse getCategoryById(Long id);

    JobCategoryResponse updateCategory(Long id, JobCategoryRequest req);
    void deleteCategory(Long id);

    JobCategory getCategoryEntityById(Long id);
}
