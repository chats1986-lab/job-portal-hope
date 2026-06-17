package com.hope.job.service;

import com.hope.job.domain.CompanyStatus;
import com.hope.job.domain.CompanyType;
import com.hope.job.domain.IndustryType;
import com.hope.job.dto.request.CompanyRequest;
import com.hope.job.dto.response.CompanyResponse;
import com.hope.job.modal.Company;

import java.util.List;

public interface CompanyService {

    CompanyResponse createCompany(Long ownerId, CompanyRequest req);
    CompanyResponse getCompanyById(Long companyId);
    CompanyResponse getMyCompany(Long ownerId);
    List<CompanyResponse> getAllCompanies(CompanyType companyType, IndustryType industryType, CompanyStatus companyStatus);
    CompanyResponse updateCompany(
            Long companyId,
            Long ownerId, CompanyRequest req
    );

    CompanyResponse verifyCompany(Long companyId);
    void deleteCompany(Long companyId, Long ownerId);
    CompanyResponse deactiveCompany(Long companyId);

    // For Inter Service Call
    Company getCompanyByEntityId(Long id);

}
