package com.medmuse.medmuse_backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "medmuse.ai")
public class AiProperties {

    private Provider provider = Provider.OPENAI;
    private final ProviderSettings gemini = new ProviderSettings();
    private final ProviderSettings openai = new ProviderSettings();

    public Provider getProvider() {
        return provider;
    }

    public void setProvider(Provider provider) {
        this.provider = provider == null ? Provider.OPENAI : provider;
    }

    public ProviderSettings getGemini() {
        return gemini;
    }

    public ProviderSettings getOpenai() {
        return openai;
    }

    public enum Provider {
        GEMINI("Gemini"),
        OPENAI("OpenAI");

        private final String displayName;

        Provider(String displayName) {
            this.displayName = displayName;
        }

        public String displayName() {
            return displayName;
        }
    }

    public static class ProviderSettings {

        private String apiKey = "";
        private String model = "";
        private Double temperature = 0.3;

        public String getApiKey() {
            return apiKey;
        }

        public void setApiKey(String apiKey) {
            this.apiKey = apiKey;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }

        public Double getTemperature() {
            return temperature;
        }

        public void setTemperature(Double temperature) {
            this.temperature = temperature;
        }
    }
}
