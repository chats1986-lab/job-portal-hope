package com.hope.job.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApplicationNoteResponse {
    private Long id;
    private Long addedByUserId;
    private String content;
    private LocalDateTime createdAt;
}
