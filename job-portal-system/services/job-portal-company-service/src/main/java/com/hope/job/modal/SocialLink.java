package com.hope.job.modal;

import com.hope.job.domain.SocialPlatform;
import jakarta.persistence.Embeddable;
import lombok.*;


@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialLink {
    private SocialPlatform platform;
    private String url;
}
