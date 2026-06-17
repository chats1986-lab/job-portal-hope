package com.hope.job.controller;

import com.hope.job.domain.CompanyStatus;
import com.hope.job.domain.CompanyType;
import com.hope.job.domain.IndustryType;
import com.hope.job.dto.request.CompanyRequest;
import com.hope.job.dto.response.ApiResponse;
import com.hope.job.dto.response.CompanyResponse;
import com.hope.job.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping
    public ResponseEntity<CompanyResponse> createCompany(
            @RequestHeader("X-User-Id") Long ownerId,
            @RequestBody @Valid CompanyRequest companyRequest
    ) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED).body(companyService.createCompany(ownerId, companyRequest));

    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponse> getCompanyId(
            @PathVariable Long id
    ) throws Exception{
        return ResponseEntity.status(HttpStatus.OK).body(companyService.getCompanyById(id));
    }


    @GetMapping("/my")
    public ResponseEntity<CompanyResponse> getMyCompany(
            @RequestHeader("X-User-Id") Long ownerId
    ) throws Exception {
        return ResponseEntity.ok(companyService.getMyCompany(ownerId));
    }

    @GetMapping
    public ResponseEntity<List<CompanyResponse>> getAllCompanies(
            @RequestParam(required = false) CompanyType companyType,
            @RequestParam(required = false) IndustryType industryType,
            @RequestParam(required = false) CompanyStatus companyStatus
            ){
        return ResponseEntity.ok(companyService.getAllCompanies( companyType, industryType, companyStatus));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompanyResponse> updateCompany(
           @PathVariable Long id,
           @RequestHeader("X-User-Id") Long ownerId,
           @RequestBody CompanyRequest req
    ) throws Exception {
        return ResponseEntity.status(HttpStatus.OK).body(
                companyService.updateCompany(id, ownerId, req)
        );
    }

    @PatchMapping("/{id}/verify")
    public ResponseEntity<CompanyResponse> verifyCompany(
            @PathVariable Long id
    ) throws Exception {
        return ResponseEntity.status(HttpStatus.OK).body(companyService.verifyCompany(id));
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<CompanyResponse> deactivateCompany(
            @PathVariable Long id
    ) throws Exception {
        return ResponseEntity.status(HttpStatus.OK).body(companyService.deactiveCompany(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteCompany(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long ownerId
    ){
        return ResponseEntity.ok(new ApiResponse("Company deleted successfully", true));
    }


}
