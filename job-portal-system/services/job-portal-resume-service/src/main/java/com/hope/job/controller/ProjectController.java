package com.hope.job.controller;

import com.hope.job.dto.response.ApiResponse;
import com.hope.job.dto.response.ProjectResponse;
import com.hope.job.payload.ProjectRequest;
import com.hope.job.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/resume/{resumeId}/projects")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectResponse> addProject(
        @PathVariable Long resumeId,
        @RequestHeader("X-User-Id") Long candidateId,
        @RequestBody @Valid ProjectRequest projectRequest
    ) throws Exception {
        return  ResponseEntity.ok(projectService.addProject(resumeId, candidateId, projectRequest));
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getProjects(
            @PathVariable Long resumeId
    ){
        return ResponseEntity.ok(projectService.getAllProject(resumeId));
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long resumeId,
            @PathVariable Long projectId,
            @RequestHeader("X-User-Id") Long candidateId,
            @RequestBody @Valid ProjectRequest projectRequest
    ) throws Exception {
        return ResponseEntity.ok(
                projectService.updateProject(projectId, resumeId, candidateId, projectRequest)
        );
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<ApiResponse> deleteProject(
            @PathVariable Long resumeId,
            @PathVariable Long projectId,
           @RequestHeader("X-User-Id") Long candidateId
    ) throws Exception {
        projectService.deleteProject( projectId, resumeId,  candidateId);
        return ResponseEntity.ok(new ApiResponse("Project deleted successfully", true));
    }

}
