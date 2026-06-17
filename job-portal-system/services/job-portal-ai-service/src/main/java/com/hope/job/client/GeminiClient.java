package com.hope.job.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import com.hope.job.config.GeminiProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class GeminiClient {

    private final Client genAiClient;
    private final GeminiProperties geminiProperties;
    private final ObjectMapper objectMapper;

    public String generateText(String systemInstruction, String prompt) throws Exception {
        return callText(systemInstruction, prompt, (float) geminiProperties.getTemperature(), geminiProperties.getMaxOutputTokens());
    }

    public <T> T generateJSON(String systemInstruction, String prompt, Class<T> responseType) throws Exception {
        return callJSON(systemInstruction, prompt, responseType);
    }

    private <T> T callJSON(String systemInstructions, String prompt, Class<T> responseType) throws Exception {
        try{

            GenerateContentConfig config =  buildConfig(systemInstructions, prompt, 0.3f, geminiProperties.getMaxOutputTokens(), true);
            GenerateContentResponse response = genAiClient.models.generateContent(
                    geminiProperties.getModel(),
                    prompt, config
            );

            return objectMapper.readValue(response.text(), responseType);
        }catch(Exception e){
            throw new Exception("Failed to get response from Gemini: " + e.getMessage()) ;
        }
    }


    private String callText(String systemInstructions, String prompt, float temperature, int maxTokens) throws Exception {
        try{

            GenerateContentConfig config =  buildConfig(systemInstructions, prompt, temperature, maxTokens, false);
            GenerateContentResponse response = genAiClient.models.generateContent(
                    geminiProperties.getModel(),
                    prompt, config
            );

            String text = response.text();
            return text;
        }catch(Exception e){
            throw new Exception("Failed to get response from Gemini: " + e.getMessage()) ;
        }
    }

    private GenerateContentConfig buildConfig(String systemInstructions, String prompt, float temperature, int maxTokens, boolean jsonMode) {

        GenerateContentConfig.Builder builder = GenerateContentConfig.builder()
                .temperature(temperature)
                .maxOutputTokens(maxTokens);

        if(systemInstructions != null && !systemInstructions.isBlank()){
            builder.systemInstruction(
                    Content.fromParts(Part.fromText(systemInstructions))
            );
        }

        if(jsonMode){
            builder.responseMimeType("application/json");
        }

        return builder.build();
    }


}
