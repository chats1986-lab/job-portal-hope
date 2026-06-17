package com.hope.job.dto.response;

import com.hope.job.domain.SkillCategory;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobSkillResponse {

    private Long id;
    private String skillName;
    private String slug;
    private SkillCategory skillCategory;
    private Boolean active;
}
