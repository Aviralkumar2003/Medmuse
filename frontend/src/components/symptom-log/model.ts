import { Symptom } from "@/services/symptomService";

export interface GuidedSymptomDetails {
  duration: string;
  location: string;
  triggers: string;
  impact: string;
  relatedSymptoms: string;
}

export interface SymptomDraft {
  draftId: string;
  symptomId: number | null;
  name: string;
  category: string;
  description: string;
  customDescription: string;
  isCustom: boolean;
  severity: number;
  notes: string;
  guidance: GuidedSymptomDetails;
}

export interface SeverityPreset {
  label: string;
  min: number;
  max: number;
  value: number;
  helper: string;
  classes: string;
}

export const severityPresets: SeverityPreset[] = [
  {
    label: "Mild",
    min: 1,
    max: 3,
    value: 3,
    helper: "Noticeable but manageable.",
    classes: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  {
    label: "Moderate",
    min: 4,
    max: 6,
    value: 5,
    helper: "Harder to ignore and affecting focus.",
    classes: "border-amber-200 bg-amber-50 text-amber-700",
  },
  {
    label: "Severe",
    min: 7,
    max: 8,
    value: 8,
    helper: "Strong enough to interrupt activities.",
    classes: "border-orange-200 bg-orange-50 text-orange-700",
  },
  {
    label: "Very severe",
    min: 9,
    max: 10,
    value: 10,
    helper: "Urgent attention may be needed.",
    classes: "border-rose-200 bg-rose-50 text-rose-700",
  },
];

function createEmptyGuidance(): GuidedSymptomDetails {
  return {
    duration: "",
    location: "",
    triggers: "",
    impact: "",
    relatedSymptoms: "",
  };
}

function createDraftId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createSymptomDraft(symptom: Symptom): SymptomDraft {
  return {
    draftId: `symptom-${symptom.id}`,
    symptomId: symptom.id,
    name: symptom.name,
    category: symptom.category,
    description: symptom.description,
    customDescription: "",
    isCustom: false,
    severity: 5,
    notes: "",
    guidance: createEmptyGuidance(),
  };
}

export function createCustomSymptomDraft(): SymptomDraft {
  return {
    draftId: createDraftId("custom"),
    symptomId: null,
    name: "Custom symptom",
    category: "Custom",
    description:
      "No symptom name needed. Describe what you're feeling, then add any helpful details below.",
    customDescription: "",
    isCustom: true,
    severity: 5,
    notes: "",
    guidance: createEmptyGuidance(),
  };
}

export function getSeverityPreset(severity: number): SeverityPreset {
  return (
    severityPresets.find(
      (preset) => severity >= preset.min && severity <= preset.max
    ) || severityPresets[1]
  );
}

export function hasStructuredGuidance(guidance: GuidedSymptomDetails): boolean {
  return Object.values(guidance).some((value) => value.trim().length > 0);
}

export function buildSymptomNotes(draft: SymptomDraft): string {
  const sections: string[] = [];

  if (draft.guidance.duration.trim()) {
    sections.push(`Duration: ${draft.guidance.duration.trim()}`);
  }
  if (draft.guidance.location.trim()) {
    sections.push(`Location: ${draft.guidance.location.trim()}`);
  }
  if (draft.guidance.triggers.trim()) {
    sections.push(`Triggers: ${draft.guidance.triggers.trim()}`);
  }
  if (draft.guidance.impact.trim()) {
    sections.push(`Impact: ${draft.guidance.impact.trim()}`);
  }
  if (draft.guidance.relatedSymptoms.trim()) {
    sections.push(`Related symptoms: ${draft.guidance.relatedSymptoms.trim()}`);
  }
  if (draft.notes.trim()) {
    sections.push(`Notes: ${draft.notes.trim()}`);
  }

  return sections.join("\n");
}

export function hasAdditionalDetails(draft: SymptomDraft): boolean {
  return draft.notes.trim().length > 0 || hasStructuredGuidance(draft.guidance);
}

export function getDraftSummaryLabel(draft: SymptomDraft): string {
  if (!draft.isCustom) {
    return draft.name;
  }

  const normalizedDescription = draft.customDescription.trim();
  if (!normalizedDescription) {
    return draft.name;
  }

  return normalizedDescription.length > 32
    ? `${normalizedDescription.slice(0, 32).trimEnd()}...`
    : normalizedDescription;
}
