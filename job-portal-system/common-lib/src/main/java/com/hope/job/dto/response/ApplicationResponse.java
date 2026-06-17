package com.hope.job.dto.response;

import com.hope.job.domain.ApplicationStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationResponse {

    private Long id;
    private UserResponse candidate;
    private Long employerId;
    private JobResponse job;
    private CompanySummaryResponse company;
    private ApplicationStatus status;

    private Long resumeId;
    private String coverLetter;

    private BigDecimal expectedSalary;
    private LocalDate availableFrom;
    private Boolean isStarred;

//    private List<ApplicationStatusHistoryResponse> statusHistory;
//    private List<InterviewResponse> interviews;
    private List<ApplicationNoteResponse> notes;

    private LocalDateTime withdrawnAt;
    private String withdrawnReason;

    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

//    private ApplicationScreeningResponse screening;
}
