package com.hope.job.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApplicationNoteRequest {
    @NotBlank(message = "Note content is required")
    @Size(max=200, message = "Note must not exceed 2000 characters")
    private String noteContent;
}
