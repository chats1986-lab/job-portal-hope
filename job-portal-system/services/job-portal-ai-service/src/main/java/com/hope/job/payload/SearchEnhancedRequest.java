package com.hope.job.payload;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SearchEnhancedRequest {
    @NotBlank(message = "Query is required to search jobs")
    private String query;
}
