package com.hope.job.modal;

import com.hope.job.dto.response.PersonalInfoResponse;
import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
 
public class PersonalInfo extends PersonalInfoResponse {
    private String firstName;
    private String lastName;
    private String headline;

    private String email;
    private String phone;
    private String city;
    private String country;

    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private String websiteUrl;
}
