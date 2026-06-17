package com.hope.job.mapper;

import com.hope.job.dto.response.*;
import com.hope.job.modal.Application;
import com.hope.job.modal.ApplicationNote;
import com.hope.job.payload.ApplicationRequest;

import java.util.List;

public class ApplicationMapper {

    public static Application toEntity(ApplicationRequest req,

                                       Long candidateId,
                                       Long companyId,
                                       Long employerId
                                       ){
       if(req == null) return null;

       return Application.builder()
               .candidateId(candidateId)
               .jobId(req.getJobId())
               .companyId(companyId)
               .employerId(employerId)
               .resumeId(String.valueOf(req.getResumeId()))
               .coverLetter(req.getCoverLetter())
               .expectedSalary(req.getExpectedSalary())
               .availableFrom(req.getAvailableFrom())
               .aiShortListStatus(com.hope.job.domain.AiShortListStatus.NOT_SCREENED)
               .status(com.hope.job.domain.ApplicationStatus.PENDING)
               .isStarred(false)
               .build();
    }
    public static ApplicationResponse toApplicationResponse(
            Application application,
            List<ApplicationNote> notes,
            JobResponse job,
            CompanyResponse company,
            UserResponse candidate
    ){
        return ApplicationResponse.builder()
                .id(application.getId())
                .candidate(candidate)
                .employerId(application.getEmployerId())
                .job(job)
                .status(application.getStatus())
                .resumeId(Long.valueOf(application.getResumeId()))
                .coverLetter(application.getCoverLetter())
                .expectedSalary(application.getExpectedSalary())
                .availableFrom(application.getAvailableFrom())
                .isStarred(application.getIsStarred())
                .notes(notes.stream().map(ApplicationMapper::toApplicationNoteResponse).toList())
                .withdrawnAt(application.getWithdrawnAt())
                .withdrawnReason(application.getWithdrawnReason())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }

    public static ApplicationNoteResponse toApplicationNoteResponse(ApplicationNote note){
        return ApplicationNoteResponse.builder()
                .id(note.getId())
                .addedByUserId(note.getAddedByUserId())
                .content(note.getContent())
                .createdAt(note.getCreatedAt())
                .build();
    }
}
