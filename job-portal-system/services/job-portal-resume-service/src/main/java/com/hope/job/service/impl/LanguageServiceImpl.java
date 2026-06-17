package com.hope.job.service.impl;

import com.hope.job.dto.response.LanguageResponse;
import com.hope.job.mapper.ResumeMapper;
import com.hope.job.modal.Language;
import com.hope.job.modal.Resume;
import com.hope.job.payload.LanguageRequest;
import com.hope.job.repository.LanguageRepository;
import com.hope.job.service.LanguageService;
import com.hope.job.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LanguageServiceImpl implements LanguageService {

    private final ResumeService resumeService;
    private final LanguageRepository languageRepository;

    @Override
    public LanguageResponse addLanguage(Long resumeId, Long candidateId, LanguageRequest req) throws Exception {
        Resume resume = resumeService.getResumeEntityById(resumeId);
        assertOwner(resume, candidateId);

        Language language = Language.builder()
                .resume(resume)
                .languageName(req.getLanguageName())
                .languageProficiency(req.getLanguageProficiency())
                .displayOrder(req.getDisplayOrder() != null ? req.getDisplayOrder() : 0)
                .build();
        Language saved = languageRepository.save(language);
        return ResumeMapper.toLanguageResponse(saved);
    }

    @Override
    public List<LanguageResponse> getAllLanguages(Long resumeId) {
        return  languageRepository.findByResume_IdOrderByDisplayOrderAsc(resumeId).stream().map(
                ResumeMapper::toLanguageResponse
        ).toList();
    }

    @Override
    public LanguageResponse updateLanguage(Long languageId, Long resumeId, Long candidateId, LanguageRequest req) throws Exception {
        Language language = languageRepository.findById(languageId).orElseThrow(
                () -> new Exception("Language not found")
        );
        assertOwner(language.getResume(), candidateId);
        language.setLanguageName(req.getLanguageName());
        language.setLanguageProficiency(req.getLanguageProficiency());
        if(req.getDisplayOrder() != null) language.setDisplayOrder(req.getDisplayOrder());
        return ResumeMapper.toLanguageResponse(languageRepository.save(language));
    }

    @Override
    public void deleteLanguage(Long languageId, Long resumeId, Long candidateId) throws Exception {
        Language language = languageRepository.findById(languageId).orElseThrow(
                () -> new Exception("Language not found")
        );
        assertOwner(language.getResume(), candidateId);
        languageRepository.delete(language);
    }

    private void assertOwner(Resume resume, Long candidateId) throws Exception {
        if(!resume.getCandidateId().equals(candidateId)){
            throw new Exception("Resume not found with the provided candidateId");
        }
    }
}
