package com.hope.job.service.impl;

import com.hope.job.dto.response.ProjectResponse;
import com.hope.job.mapper.ResumeMapper;
import com.hope.job.modal.Project;
import com.hope.job.modal.Resume;
import com.hope.job.payload.ProjectRequest;
import com.hope.job.repository.ProjectRepository;
import com.hope.job.service.ProjectService;
import com.hope.job.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {
    private final ResumeService resumeService;
    private final ProjectRepository projectRepository;

    @Override
    public ProjectResponse addProject(Long resumeId, Long candidateId, ProjectRequest req) throws Exception {

        Resume resume = resumeService.getResumeEntityById(resumeId);
        assertOwner(resume, candidateId);

        Project project = Project.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .resume(resume)
                .technologies(req.getTechnologies())
                .projectUrl(req.getProjectUrl())
                .sourceCodeUrl(req.getSourceCodeUrl())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .isOngoing(Boolean.TRUE.equals(req.getIsOngoing()))
                .displayOrder(req.getDisplayOrder() != null ? req.getDisplayOrder() : 0)
                .build();

        Project saved = projectRepository.save(project);
        return ResumeMapper.toProjectResponse(saved);
    }

    @Override
    public List<ProjectResponse> getAllProject(Long resumeId) {

        return projectRepository.findByResume_IdOrderByDisplayOrderAsc(resumeId).stream().map(
                ResumeMapper::toProjectResponse
        ).toList();
    }

    @Override
    public ProjectResponse updateProject(Long projectId, Long resumeId, Long candidateId, ProjectRequest req) throws Exception {

        Project project = projectRepository.findById(projectId).orElseThrow(
                () -> new Exception("Project is not found")
        );
        assertOwner(project.getResume(), candidateId);
        project.setTitle(req.getTitle());
        project.setDescription(req.getDescription());
        if(req.getTechnologies() != null) project.setTechnologies(req.getTechnologies());
        project.setProjectUrl(req.getProjectUrl());
        project.setSourceCodeUrl(req.getSourceCodeUrl());
        project.setStartDate(req.getStartDate());
        project.setEndDate(req.getEndDate());
        project.setIsOngoing(Boolean.TRUE.equals(req.getIsOngoing()));
        if(req.getDisplayOrder() != null) project.setDisplayOrder(req.getDisplayOrder());
        return ResumeMapper.toProjectResponse(projectRepository.save(project));
    }

    @Override
    public void deleteProject(Long projectId, Long resumeId, Long candidateId) throws Exception {
        Project project = projectRepository.findById(projectId).orElseThrow(
                () -> new Exception("Project is not found")
        );
        assertOwner(project.getResume(), candidateId);
        projectRepository.delete(project);
    }

    private void assertOwner(Resume resume, Long candidateId) throws Exception {
        if(!resume.getCandidateId().equals(candidateId)){
            throw new Exception("Resume not found with the provided candidateId");
        }
    }
}
