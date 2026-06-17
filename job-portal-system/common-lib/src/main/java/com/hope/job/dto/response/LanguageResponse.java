package com.hope.job.dto.response;

import com.hope.job.domain.LanguageProficiency;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LanguageResponse {
    private Long id;
    private String languageName;
    private LanguageProficiency languageProficiency;
    private Integer displayOrder;

}
