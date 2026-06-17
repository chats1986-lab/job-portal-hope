package com.hope.job.controller;

import com.hope.job.dto.response.ApiResponse;
import com.hope.job.dto.response.LanguageResponse;
import com.hope.job.payload.LanguageRequest;
import com.hope.job.service.LanguageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/resumes/{resumeId}/languages")
public class LanguageController {

    private final LanguageService languageService;

    @PostMapping
    public ResponseEntity<LanguageResponse> addLanguage(
            @PathVariable Long resumeId,
            @RequestHeader("X-User-Id") Long candidateId,
            @RequestBody @Valid LanguageRequest languageRequest) throws Exception {
        return ResponseEntity.ok(languageService.addLanguage(resumeId, candidateId,languageRequest));
    }

    @GetMapping
    public ResponseEntity<List<LanguageResponse>> findLanguage(
            @PathVariable Long resumeId
    ){
        return ResponseEntity.ok(languageService.getAllLanguages(resumeId));
    }

    @PutMapping("/{languageId}")
    public ResponseEntity<LanguageResponse> updateLanguage(
            @PathVariable Long resumeId,
            @PathVariable Long languageId,
            @RequestHeader("X-User-Id") Long candidateId,
            @RequestBody @Valid LanguageRequest languageRequest
    ) throws Exception {
        return ResponseEntity.ok(
                languageService.updateLanguage(languageId, resumeId, candidateId, languageRequest)
        );
    }

    @DeleteMapping("/{languageId}")
    public ResponseEntity<ApiResponse> deleteLanguage(
            @PathVariable Long resumeId,
            @PathVariable Long languageId,
            @RequestHeader("X-User-Id") Long candidateId
    ) throws Exception {
        languageService.deleteLanguage(languageId, resumeId, candidateId);
        return ResponseEntity.ok(new ApiResponse("language deleted successfully", true));
    }
}
