package com.hope.job.service;

import com.hope.job.client.GeminiClient;
import com.hope.job.payload.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class ApplicationAiService {
    private final GeminiClient geminiClient;

    private static final String SYSTEM_PROMPT = """
            You are a senior technical recruiter and carrier coach with 15+ years of experience in the Indian tech industry.
            You specialize in candidate evaluation, cover letter writting, skills gap analysis, and career developement.
            Always provide objective, fair, and actionable assessments based only on the information provided.
            When asked for JSON, respond ONLY with valid JSON - no explanation, no markdown fences.
            """;

    public AiTextResponse generateCoverLetter(CoverLetterRequest req) throws Exception {
        String skills = req.getCandidateSkills() != null ? String.join(", ", req.getCandidateSkills()) : "not provided";

        String experience = req.getCandidateExperiences() != null ? String.join(", ",  req.getCandidateExperiences()) : "not provided";

        String prompt = """
                Write a compelling, personalised cover letter.
                
                Position: %s
                Job Description: %s
                Target Company: %s
                
                Candidate Profile:
                - Name: %s
                - Professional Summary: %s
                - Key Skills: %s
                - Relevant Experience: %s
                
                Write a 3-paragraph cover letter:
                Paragraph 1 (Opening): Express specific enthusiasm for this exact role and company. Mention 1 specific thing about the role that excites you.
                Paragraph 2 (Body): Connect 2-3 of the candidate's strongest experiences/skills directly to the job requirements. Be specific with examples.
                Paragraph 3 (Closing): Confident call to action. Express eagerness to discuss further.
                
                
                Rules:
                - Write as the candidate (first person)
                - Be specific - avoid generic statements
                - Maximum 300 words
                - Professional but warm tone
                - DO NOT use placeholders like [Company Name] - use the actual company name or say "your team"
                - DO NOT include subject line or date
                """.formatted(
                        req.getJobTitle(),
                req.getJobDescription()!= null ? req.getJobDescription() : "not provided",
                req.getTargetCompanyName()!= null ? req.getTargetCompanyName() : "your organisation",
                req.getCandidateName(),
                req.getCandidateSummary()!=null ? req.getCandidateSummary() : "Experienced Professional",
                skills,
                experience
        );

        return AiTextResponse.builder()
                .content(geminiClient.generateText(SYSTEM_PROMPT, prompt))
                .build();

    }

    public ScreeningScoreResponse scoreCandidate(ScreeningScoreRequest req) throws Exception{
        String requiredSkills = req.getRequiredSkills() != null ? String.join(", ", req.getRequiredSkills()) : "not provided";
        String candidateSkills = req.getCandidateSkills() != null ? String.join(", ", req.getCandidateSkills()) : "not provided";
        String candidateExperiences = req.getCandidateExperiences() != null ? String.join(", ", req.getCandidateExperiences()) : "not provided";

        String prompt = """
                Score this job applciation based on how well the candidate matches the requirements.
                
                Job Requirements:
                - Title: %s
                - Experience Level Required: %s
                - Required Skills: %s
                - Key Responsibilities: %s  
                
                Candidate Profile:
                - Professional Summary: %s
                - Skills: %s
                - Experience History: %s
                
                {
                    "score": 85%,
                    "skillsMatchScore": 90,
                    "educationMatchScore": 90,
                    "matchedSkills": ["skill1", "skill2"],
                    "missingSkills": ["strength1", "strength2"],
                    "concerns": ["concerns1", "concerns2"],
                    "summary": "2-3 sentence honest assessment of this candidate's fit"
                }
                
                Score scale: 0-100 where 100 is a perfect match.
                skillsMatchScore: how well candidate skills match required skills (0-100).
                experienceMatchScore: how well candidate experience matches required level (0-100).
                educationMatchScore: how well candidate education/background fits the role (0-100).
                score: overall weighted match considering all factors. Be objective and fair.
                """.formatted(
                        req.getJobTitle()!=null ? req.getJobTitle() : "not provided",
                req.getExperienceLevel()!=null ? req.getExperienceLevel() : "not provided",
                requiredSkills,
                req.getResponsibilities()!=null ? req.getResponsibilities() : "not provided",
                req.getCandidateSummary()!=null ? req.getCandidateSummary() : "Experienced Professional",
                candidateSkills,
                candidateExperiences
        );

        return geminiClient.generateJSON(SYSTEM_PROMPT, prompt, ScreeningScoreResponse.class);
    }

    public SkillsGapResponse analyzeSkillsGap(SkillsGapRequest req) throws Exception{

        String candidateSkills = req.getCandidateSkills() != null ? String.join(", ", req.getCandidateSkills()) : "not provided";
        String requiredSkills = req.getRequiredSkills() != null ? String.join(", ", req.getRequiredSkills()) : "not provided";

        String prompt = """
                Analyze the skills gap between a candidate and a job requirement.
                
                Job Title: %s
                Candidate's Current Skills: %s
                Skills Required for the Job: %s
                
                {
                    "matchedSkills": ["skills candidate has that are required"],
                    "missingSkills": ["required skills candidate completely lacks"],
                    "partialMatch": ["skills candidate has partially or related version of"],
                    "prioritySkillsToLearn": ["top 3 skills to learn first, in order of importance"],
                    "learningRecommendations": [
                        {"skills": "skill name", "why": "why this skill is important for the role", "howToLearn": "specific learning resource or approach"
                    ],
                    "overallReadiness": "Ready or Partially Ready or Needs Development",
                    "summary": "2-sentence honest assessment of this candidate's fit"
                }
                """.formatted(
                        req.getJobTitle(),
                candidateSkills,
                requiredSkills
        );

        return geminiClient.generateJSON(SYSTEM_PROMPT, prompt, SkillsGapResponse.class);
    }

}
