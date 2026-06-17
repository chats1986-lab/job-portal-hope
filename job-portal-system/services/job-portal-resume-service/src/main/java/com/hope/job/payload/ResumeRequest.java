package com.hope.job.payload;

import com.hope.job.domain.ResumeTemplate;
import com.hope.job.domain.ResumeVisibility;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeRequest {

    @NotBlank(message ="title is required")
    private String title;

    @NotNull(message ="Resume template is required")
    private ResumeTemplate template;

    @NotNull(message ="Resume visibility is required")
    private ResumeVisibility visibility;

    @Builder.Default
    private Boolean isDefault=false;


}
