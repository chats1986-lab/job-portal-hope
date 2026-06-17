package com.hope.job.service;

import com.hope.job.client.GeminiClient;
import com.hope.job.payload.AiTextResponse;
import com.hope.job.payload.JobDescriptionRequest;
import com.hope.job.payload.SalaryRangeRequest;
import com.hope.job.payload.SalaryRangeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JobAiService {
    private final GeminiClient geminiClient;

    String SYSTEM_PROMPT = """
                You are a senior HR professional and technical recruiter with deep knowledge of the Indian job market (2025-2026).
                You specialize in writing job descriptions, compensation benchmarking, and talent acquisition.
                Always write in a professional, engaging, inclusive, and bias-free tone.
                When asked for JSON, respond only with valid JSON - no explanation, no markdown fences.
            """;
    public AiTextResponse generateJobDescription(JobDescriptionRequest req) throws Exception {

        String skills = req.getSkills() != null ? String.join(", ", req.getSkills()) : "Not Specified";
        String prompt = """
                Write a comprehensive, engaging, and inclusive job description.
                
                Job Details:
                - Title: %s
                - Required Skills: %s
                - Experience Level: %s
                - Job Type: %s
                - Work Mode: %s
                - Category: %s
                - Additional Context: %s
                
                Format the response in clean markdown with EXACTLY these sections:
                ### About the Role
                [2-3 compelling sentences describing the role and its impact]
                
                ## Key Responsibility
                - [6 specific, action-oriented bullet points]
                
                ## Requirement
                - [5-6 must-have qualifications and skills]
                
                ## Nice to Have
                - [3-4 bonus qualifications]
                
                ## What we offer
                = [4-5 benefits and perks]
                
                Do not include placeholder company names.
                """.formatted(
                        req.getTitle(),
                        skills,
                        req.getExperienceLevel() != null ?  req.getExperienceLevel() : "not specified",
                        req.getJobType() != null ? req.getJobType() : "not specified",
                        req.getWorkMode() != null ? req.getWorkMode() : "not specified",
                        req.getCategory() != null ? req.getCategory() : "not specified",
                        req.getAdditionalContext() != null ? req.getAdditionalContext() : "none"
                );

        return AiTextResponse.builder()
                .content(geminiClient.generateText(SYSTEM_PROMPT, prompt))
                .build();

    }

    public AiTextResponse generateJobRequirements(String title, String category) throws Exception {
        String prompt = """
                Generate professional job requirements and responsibilities for this role.
                
                Job Title: %s
                Category: %s
                
                Format in markdown:
                ## Responsibilities
                - [5 specific bullet points]
                
                ## Requirements
                - [5 specific bullet points]
                
                Keep it concise and ATS-friendly
                """.formatted(title, category);
        return AiTextResponse.builder()
                .content(geminiClient.generateText(SYSTEM_PROMPT, prompt))
                .build();
    }

    public SalaryRangeResponse suggestSalaryRange(SalaryRangeRequest req) throws Exception{

        String skills = req.getSkills() != null ? String.join(", ", req.getSkills()) : "Not Specified";
        String prompt= """
                Provide a realistic and competitive salary range for this role.
                
                Role Details:
                - Job Title: %s
                - Required Skills: %s
                - Experience Level: %s
                - Job Type: %s
                - Location: %s
                
                {
                    "minSalary": 600000,
                    "maxSalary": 1200000,
                    "currency": "INR",
                    "period": "YEARLY",
                    "marketInsight": "Breif 1-2 sentence insight about this role's compensation trend in the current Indian market"
                }
                
                minSalary and maxSalary must be numbers (not strings). Use realistic current Indian market rates.
                """.formatted(
                        req.getTitle() != null ? req.getTitle() : "not specified",
                        skills,
                        req.getExperienceLevel() != null ? req.getExperienceLevel() : "MID",
                        req.getJobType() != null ? req.getJobType() : "FuLL_TIME",
                        req.getLocation() != null ? req.getLocation() : "India"
        );

        return geminiClient.generateJSON(SYSTEM_PROMPT, prompt, SalaryRangeResponse.class);

    }

    public AiTextResponse generateJobResponsibilities(String title, String category) throws Exception{

        String prompt = """
                Generate 6 specific, action-oriented job responsibilities for this role.
                
                Job Title: %s
                Category: %s
                
                Return only a plain bullet list (no headings, no markdown headers):
                - [responsibility1]
                - [responsibility2]
                ...
                
                Keep each bullet concise (under 15 words), start with a strong action verb.
                """.formatted(title, category);

        return AiTextResponse.builder()
                .content(geminiClient.generateText(SYSTEM_PROMPT, prompt))
                .build();

    }

    public AiTextResponse generateJobBenefits(String title, String category, String jobType) throws Exception{
        String prompt = """
                Generate 6 competitive, attractive job benefits for this role.
                
                Job Title: %s
                Category: %s
                Job Type: %s
                
                Return ONLY a plain bullet list (no headings, no markdown headers):
                - [benefits1]
                - [benefits2]
                ...
                
                Include a mix of: compensation perks, health/weakness, growth, flexibility, and culture benefits. Keep each bullet concise and specific.
                """.formatted(title,
                category != null ? category: "General",
                jobType != null ? jobType: "Full Time");

        return AiTextResponse.builder()
                .content(geminiClient.generateText(SYSTEM_PROMPT, prompt))
                .build();
    }

    public AiTextResponse recommendSkillsForJob(String jobTitle, String description) throws Exception{
        String prompt = """
                Recommend the most relevant skills for this job posting.
                
                Job Title: %s
                Description: %s
                
                List 8-10 specific, relevant skills that candidates should have.
                Return a comma-seperated list of skill names only.
                Example: Java, Spring Boot, PostgreSQL, Docker, Rest APIs, Microservices
                """.formatted(jobTitle, description);

        return AiTextResponse.builder()
                .content(geminiClient.generateText(SYSTEM_PROMPT, prompt))
                .build();
    }

    public AiTextResponse recommendedTagsForJob(String jobTitle, String description) throws Exception{
        String prompt = """
                Recommend 8-10 relevant tags/keywords for this job posting that improve discoverability.
                
                Job Title: %s
                Description: %s
                
                Return ONLY a comma-seperated list of short tag names (1-3 words each).
                Example: React, Frontend, JavaScript, Remote, Startup, Full Stack, Web Development
                """.formatted(jobTitle, description);
        return AiTextResponse.builder()
                .content(geminiClient.generateText(SYSTEM_PROMPT, prompt))
                .build();
    }
}
