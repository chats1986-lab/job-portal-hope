package com.hope.job.service;

import com.hope.job.dto.response.LanguageResponse;
import com.hope.job.payload.LanguageRequest;

import java.util.List;

public interface LanguageService {
    LanguageResponse addLanguage(Long resumeId, Long candidateId, LanguageRequest req) throws Exception;

    List<LanguageResponse> getAllLanguages(Long resumeId);

    LanguageResponse updateLanguage(Long languageId, Long resumeId, Long candidateId, LanguageRequest req) throws Exception;

    void deleteLanguage(Long languageId, Long resumeId, Long candidateId) throws Exception;

}
