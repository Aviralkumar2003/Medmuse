package com.medmuse.medmuse_backend.service.ai;

public enum AIProvider {
    GEMINI("gemini"),
    OPENAI("openai");
    
    private final String providerName;
    
    AIProvider(String providerName) {
        this.providerName = providerName;
    }
    
    public String getProviderName() {
        return providerName;
    }
    
    public static AIProvider fromString(String text) {
        for (AIProvider provider : AIProvider.values()) {
            if (provider.providerName.equalsIgnoreCase(text)) {
                return provider;
            }
        }
        throw new IllegalArgumentException("No AI provider found for: " + text);
    }
}