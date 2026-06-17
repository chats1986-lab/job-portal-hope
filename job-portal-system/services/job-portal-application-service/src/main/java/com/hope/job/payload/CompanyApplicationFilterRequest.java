package com.hope.job.payload;

import com.hope.job.domain.AiShortListStatus;
import com.hope.job.domain.ApplicationStatus;
import lombok.Data;

@Data
public class CompanyApplicationFilterRequest {
    private Long jobId;
    private ApplicationStatus status;
    private boolean isStarred;
    private AiShortListStatus aiShortListStatus;
    private Integer minAiScore;
    private String sortBy;
}
