package com.medmuse.medmuse_backend.config;
import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.medmuse.medmuse_backend.entity.Symptom;
import com.medmuse.medmuse_backend.repository.SymptomRepository;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private final SymptomRepository symptomRepository;
    
    public DataInitializer(SymptomRepository symptomRepository) {
        this.symptomRepository = symptomRepository;
    }
    
    @Override
    public void run(String... args) throws Exception {
        if (symptomRepository.count() == 0) {
            initializeSymptoms();
        }
    }
    
    private void initializeSymptoms() {
        List<Symptom> symptoms = Arrays.asList(
            // General
            new Symptom("Fatigue", "General", "Feeling tired or exhausted"),
            new Symptom("Fever", "General", "Elevated body temperature"),
            new Symptom("Chills", "General", "Feeling cold or shivering"),
            new Symptom("Night sweats", "General", "Excessive sweating during sleep"),
            new Symptom("Weight loss", "General", "Unintentional loss of body weight"),
            new Symptom("Weight gain", "General", "Unintentional increase in body weight"),
            new Symptom("Loss of appetite", "General", "Reduced desire to eat"),
            new Symptom("General weakness", "General", "Overall feeling of weakness"),
            
            // Pain
            new Symptom("Headache", "Pain", "Pain in the head or neck area"),
            new Symptom("Back pain", "Pain", "Pain in the back or spine"),
            new Symptom("Joint pain", "Pain", "Pain in joints or connective tissues"),
            new Symptom("Muscle pain", "Pain", "Pain or soreness in muscles"),
            new Symptom("Chest pain", "Pain", "Pain in the chest area"),
            new Symptom("Abdominal pain", "Pain", "Pain in the stomach or abdominal area"),
            new Symptom("Neck pain", "Pain", "Pain in the neck area"),
            
            // Respiratory
            new Symptom("Cough", "Respiratory", "Persistent coughing"),
            new Symptom("Shortness of breath", "Respiratory", "Difficulty breathing or breathlessness"),
            new Symptom("Wheezing", "Respiratory", "Whistling sound when breathing"),
            new Symptom("Chest tightness", "Respiratory", "Feeling of tightness in the chest"),
            new Symptom("Runny nose", "Respiratory", "Nasal discharge"),
            new Symptom("Stuffy nose", "Respiratory", "Nasal congestion"),
            new Symptom("Sore throat", "Respiratory", "Pain or irritation in the throat"),
            new Symptom("Sneezing", "Respiratory", "Frequent sneezing"),
            
            // Digestive
            new Symptom("Nausea", "Digestive", "Feeling sick to stomach"),
            new Symptom("Vomiting", "Digestive", "Throwing up"),
            new Symptom("Diarrhea", "Digestive", "Loose or watery bowel movements"),
            new Symptom("Constipation", "Digestive", "Difficulty having bowel movements"),
            new Symptom("Heartburn", "Digestive", "Burning sensation in chest or throat"),
            new Symptom("Bloating", "Digestive", "Feeling of fullness or swelling in abdomen"),
            
            // Neurological
            new Symptom("Dizziness", "Neurological", "Feeling lightheaded or unsteady"),
            new Symptom("Memory issues", "Neurological", "Problems with memory or concentration"),
            new Symptom("Confusion", "Neurological", "Difficulty thinking clearly"),
            new Symptom("Numbness", "Neurological", "Loss of sensation in body parts"),
            new Symptom("Tingling", "Neurological", "Pins and needles sensation"),
            new Symptom("Balance problems", "Neurological", "Difficulty maintaining balance"),
            new Symptom("Vision changes", "Neurological", "Changes in eyesight or vision"),
            
            // Skin
            new Symptom("Rash", "Skin", "Skin irritation or outbreak"),
            new Symptom("Itching", "Skin", "Skin itchiness or urge to scratch"),
            new Symptom("Dry skin", "Skin", "Skin lacking moisture"),
            new Symptom("Bruising", "Skin", "Discoloration from injury"),
            new Symptom("Hair loss", "Skin", "Loss of hair"),
            new Symptom("Changes in moles", "Skin", "Changes in size, color, or shape of moles"),
            
            // Sleep
            new Symptom("Insomnia", "Sleep", "Difficulty falling or staying asleep"),
            new Symptom("Sleep disruption", "Sleep", "Frequent waking during sleep"),
            new Symptom("Daytime sleepiness", "Sleep", "Excessive tiredness during the day"),
            new Symptom("Restless sleep", "Sleep", "Sleep that is not refreshing"),
            new Symptom("Sleep apnea symptoms", "Sleep", "Breathing interruptions during sleep")
        );
        
        symptomRepository.saveAll(symptoms);
        System.out.println("Initialized " + symptoms.size() + " symptoms");
    }
}
