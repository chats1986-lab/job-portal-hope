package com.hope.job.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiTextResponse {
    private String content;

    @Builder.Default
    private LocalDateTime generatedAt=LocalDateTime.now();
}
