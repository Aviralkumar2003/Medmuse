package com.medmuse.medmuse_backend.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.request.ResponseFormat;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import dev.langchain4j.model.openai.OpenAiChatModel;

@Configuration
@EnableConfigurationProperties(AiProperties.class)
public class AiConfig {

    @Bean
    public ChatModel chatModel(AiProperties properties) {
        return switch (properties.getProvider()) {
            case GEMINI -> buildGeminiModel(properties.getGemini());
            case OPENAI -> buildOpenAiModel(properties.getOpenai());
        };
    }

    private ChatModel buildGeminiModel(AiProperties.ProviderSettings settings) {
        GoogleAiGeminiChatModel.GoogleAiGeminiChatModelBuilder builder = GoogleAiGeminiChatModel.builder()
                .apiKey(trimToEmpty(settings.getApiKey()))
                .modelName(defaultIfBlank(settings.getModel(), "gemini-2.0-flash"))
                .responseFormat(ResponseFormat.JSON);

        if (settings.getTemperature() != null) {
            builder.temperature(settings.getTemperature());
        }

        return builder.build();
    }

    private ChatModel buildOpenAiModel(AiProperties.ProviderSettings settings) {
        OpenAiChatModel.OpenAiChatModelBuilder builder = OpenAiChatModel.builder()
                .apiKey(trimToEmpty(settings.getApiKey()))
                .modelName(defaultIfBlank(settings.getModel(), "gpt-5.4"))
                .responseFormat(ResponseFormat.JSON);

        if (settings.getTemperature() != null) {
            builder.temperature(settings.getTemperature());
        }

        return builder.build();
    }

    @Bean("activeAiProviderName")
    public String activeAiProviderName(AiProperties properties) {
        return properties.getProvider().displayName();
    }

    private String trimToEmpty(String value) {
        return value == null ? "" : value.trim();
    }

    private String defaultIfBlank(String value, String fallback) {
        String trimmedValue = trimToEmpty(value);
        return trimmedValue.isEmpty() ? fallback : trimmedValue;
    }
}
