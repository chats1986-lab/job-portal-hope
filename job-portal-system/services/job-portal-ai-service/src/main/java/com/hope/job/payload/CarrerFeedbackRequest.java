package com.hope.job.payload;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CarrerFeedbackRequest {

    @NotBlank(message = "Resume content is required")
    private String resumeContent;

    private String targetJobTitle;
}
