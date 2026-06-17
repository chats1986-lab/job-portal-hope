package com.hope.job.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedJobResponse {
    private Long id;
    private Long candidateId;
    private Long jobId;
    private LocalDateTime savedAt;
}
