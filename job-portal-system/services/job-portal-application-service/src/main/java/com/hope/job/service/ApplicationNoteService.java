package com.hope.job.service;

import com.hope.job.dto.response.ApplicationNoteResponse;
import com.hope.job.payload.ApplicationNoteRequest;

import java.util.List;

public interface ApplicationNoteService {
    ApplicationNoteResponse addNote(Long applicationId, Long employerId, ApplicationNoteRequest req) throws Exception;

    List<ApplicationNoteResponse> getNotesByApplication(Long applicationId, Long employerId);

    void deleteNote(Long applicationId, Long noteId, Long employerId) throws Exception;
}
