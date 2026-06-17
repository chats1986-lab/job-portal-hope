package com.hope.job.controller;

import com.hope.job.dto.response.ApiResponse;
import com.hope.job.dto.response.ApplicationNoteResponse;
import com.hope.job.payload.ApplicationNoteRequest;
import com.hope.job.service.ApplicationNoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/applications/{applicationId}/notes")
public class ApplicationNoteController {

    private final ApplicationNoteService applicationNoteService;

    @PostMapping
    public ResponseEntity<ApplicationNoteResponse> addNote(
            @PathVariable Long applicationId,
            @RequestHeader("X-User-Id") Long employerId,
            @RequestBody @Valid ApplicationNoteRequest req
    ) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationNoteService.addNote(applicationId, employerId, req));
    }

    @GetMapping
    public ResponseEntity<List<ApplicationNoteResponse>> getNotes(
            @PathVariable Long applicationId,
            @RequestHeader("X-User-Id") Long employerId
    ){
        return ResponseEntity.ok(applicationNoteService.getNotesByApplication(applicationId, employerId));
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<ApiResponse> deleteNote(
            @PathVariable Long applicationId,
            @PathVariable Long noteId,
            @RequestHeader("X-User-Id") Long employerId
    ) throws Exception {
        applicationNoteService.deleteNote(applicationId, noteId, employerId);
        return ResponseEntity.ok(new ApiResponse("Note delete successfully", true));
    }


}
