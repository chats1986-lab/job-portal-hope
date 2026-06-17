package com.hope.job.service.impl;

import com.hope.job.dto.response.ApplicationNoteResponse;
import com.hope.job.mapper.ApplicationMapper;
import com.hope.job.modal.Application;
import com.hope.job.modal.ApplicationNote;
import com.hope.job.payload.ApplicationNoteRequest;
import com.hope.job.repository.ApplicationNoteRepository;
import com.hope.job.service.ApplicationNoteService;
import com.hope.job.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationNoteServiceImpl implements ApplicationNoteService {
    private final ApplicationService applicationService;
    private final ApplicationNoteRepository applicationNoteRepository;

    @Override
    public ApplicationNoteResponse addNote(Long applicationId, Long employerId, ApplicationNoteRequest req) throws Exception {

        Application application = applicationService.getApplicationEntity(applicationId);
        assertEmployer(application, employerId);
        ApplicationNote applicationNote = ApplicationNote.builder()
                .application(application)
                .addedByUserId(employerId)
                .content(req.getNoteContent())
                .build();
        ApplicationNote savedNote = applicationNoteRepository.save(applicationNote);
        return ApplicationMapper.toApplicationNoteResponse(savedNote);
    }

    @Override
    public List<ApplicationNoteResponse> getNotesByApplication(Long applicationId, Long employerId) {
        return applicationNoteRepository.findByApplicationId(applicationId).stream()
                .map(ApplicationMapper::toApplicationNoteResponse)
                .toList();
    }

    @Override
    public void deleteNote(Long applicationId, Long noteId, Long employerId) throws Exception {
        Application application = applicationService.getApplicationEntity(applicationId);
        assertEmployer(application, employerId);

        ApplicationNote note = applicationNoteRepository.findById(noteId).orElseThrow(
                () -> new Exception("Note does not belong to application")
        );
        applicationNoteRepository.delete(note);
    }

    private void assertEmployer(Application application,Long employerId) throws Exception {
        if(!application.getEmployerId().equals(employerId)){
            throw new Exception("You are not the employer for this application");
        }
    }
}
