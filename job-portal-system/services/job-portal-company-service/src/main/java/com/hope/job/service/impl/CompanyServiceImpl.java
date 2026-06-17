package com.hope.job.service.impl;

import com.hope.job.domain.CompanyStatus;
import com.hope.job.domain.CompanyType;
import com.hope.job.domain.IndustryType;
import com.hope.job.dto.request.CompanyRequest;
import com.hope.job.dto.response.CompanyResponse;
import com.hope.job.dto.response.SocialLinkResponse;
import com.hope.job.exception.BusinessException;
import com.hope.job.exception.ResourceNotFoundException;
import com.hope.job.mapper.CompanyMapper;
import com.hope.job.modal.Company;
import com.hope.job.modal.SocialLink;
import com.hope.job.repository.CompanyRepository;
import com.hope.job.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;

    @Override
    public CompanyResponse createCompany(Long ownerId, CompanyRequest req) {

        if(companyRepository.existsByOwnerId(ownerId)) {
            throw new BusinessException("Company is already registered");
        }

        if(companyRepository.existsByName(req.getName())) {
            throw new BusinessException("Company already exists, Please choose a different name");
        }

        if(req.getRegistrationNumber() != null &&
                companyRepository.existsByRegistrationNumber(req.getRegistrationNumber())) {
            throw new BusinessException("Company already registered, Please choose a different registration number");
        }

        String slug = generateUniqueSlug(req.getName());

        Company company = Company.builder()
                .name(req.getName())
                .slug(slug)
                .tagline(req.getTagline())
                .description(req.getDescription())
                .logoUrl(req.getLogoUrl())
                .coverImageUrl(req.getCoverImageUrl())
                .website(req.getWebsite())
                .email(req.getEmail())
                .phone(req.getPhone())
                .foundedYear(String.valueOf(req.getFoundedYear()))
                .companySize(req.getCompanySize())
                .companyType(req.getCompanyType())
                .industryType(req.getIndustryType())
                .registrationNumber(req.getRegistrationNumber())
                .ownerId(ownerId)
                .socialLinks(mapSocialLinks(req.getSocialLinks()))
                .build();

        Company saved = companyRepository.save(company);
        return CompanyMapper.toResponse(saved);
    }

    private List<SocialLink> mapSocialLinks(List<SocialLinkResponse> socialLinks) {
        if(socialLinks == null || socialLinks.isEmpty()) {
            return new ArrayList<SocialLink>();
        }
       return socialLinks.stream()
               .map(e -> SocialLink.builder()
                       .platform(e.getPlatform())
                       .url(e.getUrl())
                       .build()).collect(Collectors.toList());
    }

    private String generateUniqueSlug(String name) {
        String base = name.toLowerCase()
                .replaceAll("[^a-zA-Z0-9]", "").trim().replaceAll("-", "");
        if(!companyRepository.existsBySlug(base)) {
            return base;
        }

        int counter = 1;
        while(companyRepository.existsBySlug(base+"-"+counter)) {
            counter++;
        }
        return base+"-"+counter;

    }

    @Override
    public CompanyResponse getCompanyById(Long companyId) {
       Company company = companyRepository.findById(companyId).orElseThrow(() -> new ResourceNotFoundException("Company", companyId));
       return CompanyMapper.toResponse(company);
    }

    @Override
    public CompanyResponse getMyCompany(Long ownerId) {
        Company company = companyRepository.findByOwnerId(ownerId).orElseThrow(() -> new ResourceNotFoundException("Company", "ownerId", ownerId.toString()));
        return CompanyMapper.toResponse(company);
    }

    @Override
    public List<CompanyResponse> getAllCompanies(
            CompanyType companyType,
            IndustryType industryType,
            CompanyStatus companyStatus) {
        return companyRepository.findByFilters(
                companyType,industryType, companyStatus
        ).stream().map(CompanyMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public CompanyResponse updateCompany(
            Long companyId,
            Long ownerId,
            CompanyRequest req) {

        Company company = getCompanyByEntityId(companyId);

        if(!company.getName().equals(req.getName()) && companyRepository.existsByName(req.getName())) {
           throw new BusinessException("Company already exists, Please choose a different name");
        }

        if(req.getRegistrationNumber() != null && !req.getRegistrationNumber().equals(company.getRegistrationNumber()) && companyRepository.existsByRegistrationNumber(req.getRegistrationNumber())) {
            throw new BusinessException("Company already registered, Please choose a different registration number");
        }

        company.setName(req.getName());
        company.setTagline(req.getTagline());
        company.setDescription(req.getDescription());
        company.setLogoUrl(req.getLogoUrl());
        company.setCoverImageUrl(req.getCoverImageUrl());
        company.setWebsite(req.getWebsite());
        company.setEmail(req.getEmail());
        company.setPhone(req.getPhone());
        company.setFoundedYear(String.valueOf(req.getFoundedYear()));
        company.setCompanySize(req.getCompanySize());
        company.setCompanyType(req.getCompanyType());
        company.setIndustryType(req.getIndustryType());
        company.setRegistrationNumber(req.getRegistrationNumber());
        company.setSocialLinks(mapSocialLinks(req.getSocialLinks()));
        return CompanyMapper.toResponse(companyRepository.save(company));

    }

    @Override
    public CompanyResponse verifyCompany(Long companyId) {
        Company company = getCompanyByEntityId(companyId);
        company.setCompanyStatus(CompanyStatus.ACTIVE);
        company.setIsVerified(true);
        return CompanyMapper.toResponse(companyRepository.save(company));
    }

    @Override
    public void deleteCompany(Long companyId, Long ownerId) {
        Company company = getCompanyByEntityId(companyId);
        assertOwner(company, ownerId);
        companyRepository.delete(company);
    }

    public void assertOwner(Company company, Long ownerId) {
        if(!company.getOwnerId().equals(ownerId)){
            throw new BusinessException("you are not the owner of this company");
        }
    }

    @Override
    public CompanyResponse deactiveCompany(Long companyId) {
        Company company = getCompanyByEntityId(companyId);
        company.setCompanyStatus(CompanyStatus.SUSPENDED);
        company.setIsVerified(false);
        return CompanyMapper.toResponse(companyRepository.save(company));
    }

    @Override
    public Company getCompanyByEntityId(Long id) {
        return companyRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Company", id)
        );
    }
}
