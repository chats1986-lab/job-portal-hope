package com.hope.job.payload;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedJobRequest {
    @NotNull(message="Job Id is required")
    private Long jobId;
}
