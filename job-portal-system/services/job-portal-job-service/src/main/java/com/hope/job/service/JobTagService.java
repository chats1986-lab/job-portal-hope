package com.hope.job.service;

import com.hope.job.dto.response.JobTagResponse;
import com.hope.job.modal.JobTag;
import com.hope.job.payload.JobTagRequest;

import java.util.List;
import java.util.Set;

public interface JobTagService {

    JobTagResponse createJobTag(JobTagRequest req);
    List<JobTagResponse> getAllJobTags();
    JobTagResponse getJobTagById(Long id);
    JobTagResponse updateJobTag(Long id, JobTagRequest req);
    void  deleteJobTagById(Long id);
    JobTag getJobTagEntityById(Long id);
    Set<JobTag> getTagsByIds(Set<Long> ids);
}
