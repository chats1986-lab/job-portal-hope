package com.hope.job.mapper;

import com.hope.job.dto.response.JobTagResponse;
import com.hope.job.modal.JobTag;

public class JobTagMapper {

    public static JobTagResponse toJobTagResponse(JobTag jobTag) {
        return JobTagResponse.builder()
                .id(jobTag.getId())
                .name(jobTag.getName())
                .slug(jobTag.getSlug())
                .build();
    }
}
