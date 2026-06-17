package com.hope.job.dto.request;

import com.hope.job.domain.CompanySize;
import com.hope.job.domain.CompanyType;
import com.hope.job.domain.IndustryType;
import com.hope.job.dto.response.SocialLinkResponse;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyRequest {

    @NotBlank(message = "company name is required")
    private String name;

    @Pattern(regexp = "^(https?://).*", message = "Website must be a valid URL")
    private String website;

    @Email(message = "Company email must be valid")
    private String email;

    private String phone;
    private String tagline;
    private String description;
    private String logoUrl;
    private String coverImageUrl;

    @Min(value=1800, message = "Founded year seems too old")
    @Max(value=2100, message="Founded year is invalid")
    private Integer foundedYear;

    @NotNull(message = "Company size is required")
    private CompanySize companySize;

    @NotNull(message = "Company type is required")
    private CompanyType companyType;

    @NotNull(message = "Industry type is required")
    private IndustryType industryType;

    private String registrationNumber;

    private List<SocialLinkResponse> socialLinks;


}
