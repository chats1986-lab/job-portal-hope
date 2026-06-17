package com.hope.job.service;

import com.hope.job.client.GeminiClient;
import com.hope.job.payload.JobAlertSuggestRequest;
import com.hope.job.payload.JobAlertSuggestResponse;
import com.hope.job.payload.SearchEnhanceResponse;
import com.hope.job.payload.SearchEnhancedRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class SearchAiService {
    private final GeminiClient geminiClient;

    private static final String SYSTEM_PROMPT= """
            You are a job search expert and career advisor with deep knowledge of the Indian job market.
            You extract structured search criteria from natural language and provide data-driven career recommendation.
            Always use the exact enum values specified in the prompt - never invent new values.
            When asked for JSON, respond ONLY with valid JSON - no explanation, no markdown fences.
            """;

    public SearchEnhanceResponse enhanceSearch(SearchEnhancedRequest req) throws Exception{

        String prompt = """
                Extract structured job search criteria from this natural language query.
                
                User Query: %s
                
                Analyze the query and extract ALL implied and explicit search criteria
                
                Valid JobTypes; FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE
                Valid workModes: REMOTE, HYBRID, ON_SITE
                Valid experienceLevels: ENTRY, MID, SENIOR, LEAD, EXECUTIVE
                
                {
                    "keywords" : ["keyword1", "keyword2"],
                    "locations" : ["location1", "location2"],
                    "jobTypes": ["FULL_TIME"],
                    "workModes" : ["REMOTE"],
                    "experienceLevels": ["ENTRY"],
                    "minSalary": null,
                    "skills": ["skills1", "skills2"],
                }
                
                Rules:
                - Only include fields that are mentioned or clearly implied
                - Use null for minSalary if not mentioned
                - Use empty arrays [] for fields not mentioned
                - "freshers" or "entry level" -> ENTRY experience Level
                - "senior" or "5+ years" -> SENIOR experience Level
                - "wfh" or "work from home" -> REMOTE work mode
                
                """.formatted(req.getQuery());

        return geminiClient.generateJSON(SYSTEM_PROMPT, prompt, SearchEnhanceResponse.class);
    }

    public JobAlertSuggestResponse suggestJobAlertCriteria(JobAlertSuggestRequest req) throws Exception{

        String skills = req.getSkills()!=null ? String.join(",", req.getSkills()) : "not provided";
        String previousJobTitles = req.getPreviousJobTitles()!=null ? String.join(",", req.getPreviousJobTitles()) : "not provided";
        String educations = req.getEducations()!=null ? String.join(",", req.getEducations()) : "not provided";

        String prompt = """
                Based on the candidate's profile, suggest optimal job alert criteria to find the best matching jobs.
                
                Candidate Profile:
                - Skills: %s
                - Experience Levels: %s
                - Previous Job Titles: %s
                - Education: %s
                
                Valid JobTypes: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE
                Valid WorkModes: REMOTE, HYBRID, ON_SITE
                Valid experienceLevels: ENTRY, MID, SENIOR, LEAD
                
                """.formatted(
                skills,
                req.getExperienceLevel(),
                previousJobTitles,
                educations
        );

        return geminiClient.generateJSON(SYSTEM_PROMPT, prompt, JobAlertSuggestResponse.class);
    }
}
