package com.hope.job.payload;

import com.hope.job.domain.LanguageProficiency;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LanguageRequest {

    @NotBlank(message = "Language name is required")
    private String languageName;

    @NotNull(message = "Proficiency level is required")
    private LanguageProficiency languageProficiency;

    private Integer displayOrder;
}
