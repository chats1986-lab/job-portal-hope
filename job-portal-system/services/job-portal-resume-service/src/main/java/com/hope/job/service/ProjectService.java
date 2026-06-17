package com.hope.job.service;

import com.hope.job.dto.response.ProjectResponse;
import com.hope.job.payload.ProjectRequest;

import java.util.List;

public interface ProjectService {
    ProjectResponse addProject(Long resumeId, Long candidateId, ProjectRequest req) throws Exception;

    List<ProjectResponse> getAllProject(Long resumeId);

    ProjectResponse updateProject(Long projectId, Long resumeId, Long candidateId, ProjectRequest req) throws Exception;

    void deleteProject(Long ProjectId, Long resumeId, Long candidateId) throws Exception;
}
