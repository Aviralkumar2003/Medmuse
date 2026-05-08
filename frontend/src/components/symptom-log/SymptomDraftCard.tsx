import { useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  MessageSquareMore,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  buildSymptomNotes,
  getSeverityPreset,
  hasAdditionalDetails,
  hasStructuredGuidance,
  severityPresets,
  SymptomDraft,
} from "./model";
import { SeveritySlider } from "./SeveritySlider";

interface SymptomDraftCardProps {
  draft: SymptomDraft;
  onUpdate: (draftId: string, nextDraft: SymptomDraft) => void;
  onRemove: (draftId: string) => void;
}

export function SymptomDraftCard({
  draft,
  onUpdate,
  onRemove,
}: SymptomDraftCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(hasAdditionalDetails(draft));
  const [guidedPromptsOpen, setGuidedPromptsOpen] = useState(
    hasStructuredGuidance(draft.guidance)
  );
  const [exactSeverityOpen, setExactSeverityOpen] = useState(false);

  const severityPreset = getSeverityPreset(draft.severity);
  const combinedNotes = buildSymptomNotes(draft);

  const updateDraft = (nextDraft: SymptomDraft) => {
    onUpdate(draft.draftId, nextDraft);
  };

  return (
    <Card className="border-border shadow-card">
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-ui text-lg font-semibold text-foreground">
                {draft.name}
              </h3>
              <Badge variant="outline">{draft.category}</Badge>
              {combinedNotes && (
                <Badge className="border-blue-200 bg-blue-50 text-blue-700">
                  Notes added
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{draft.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div
              className={cn(
                "rounded-full border px-3 py-1 text-sm font-ui font-medium",
                severityPreset.classes
              )}
            >
              {severityPreset.label} - {draft.severity}/10
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDetailsOpen((current) => !current)}
            >
              {detailsOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              {detailsOpen ? "Hide details" : "Add details"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(draft.draftId)}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>

        {draft.isCustom && (
          <div className="space-y-2">
            <Label
              htmlFor={`custom-description-${draft.draftId}`}
              className="font-ui"
            >
              What are you feeling?
            </Label>
            <Textarea
              id={`custom-description-${draft.draftId}`}
              value={draft.customDescription}
              onChange={(event) =>
                updateDraft({
                  ...draft,
                  customDescription: event.target.value,
                })
              }
              placeholder="Describe the feeling in your own words, like tightness across my chest or an uneasy fluttering in my stomach"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              No symptom name needed. This description is what will be saved.
            </p>
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-4">
          {severityPresets.map((preset) => {
            const isActive =
              draft.severity >= preset.min && draft.severity <= preset.max;

            return (
              <Button
                key={preset.label}
                type="button"
                variant={isActive ? "medical" : "soft"}
                size="sm"
                onClick={() =>
                  updateDraft({
                    ...draft,
                    severity: preset.value,
                  })
                }
                className="h-auto min-h-14 flex-col items-start gap-1 px-4 py-3 text-left"
              >
                <span>{preset.label}</span>
                <span className="text-[11px] font-normal opacity-80">
                  {preset.helper}
                </span>
              </Button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-muted-foreground">{severityPreset.helper}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setExactSeverityOpen((current) => !current)}
            className="h-auto px-0 text-primary hover:bg-transparent hover:text-primary"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {exactSeverityOpen ? "Hide exact scale" : "Fine-tune 1-10"}
          </Button>
        </div>

        {exactSeverityOpen && (
          <SeveritySlider
            value={draft.severity}
            onChange={(value) => updateDraft({ ...draft, severity: value })}
          />
        )}

        {draft.severity >= 9 && (
          <Alert className="border-rose-200 bg-rose-50 text-rose-900 [&>svg]:text-rose-600">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Very severe symptom</AlertTitle>
            <AlertDescription>
              If this feels urgent, unsafe, or rapidly worsening, contact a healthcare professional.
            </AlertDescription>
          </Alert>
        )}

        {!detailsOpen && combinedNotes && (
          <div className="rounded-lg border border-border bg-background-soft p-3">
            <div className="mb-1 text-xs font-ui uppercase tracking-wide text-muted-foreground">
              Detail preview
            </div>
            <p className="whitespace-pre-line text-sm text-foreground">
              {combinedNotes}
            </p>
          </div>
        )}

        {detailsOpen && (
          <>
            <Separator />
            <div className="space-y-4 pt-1">
              <div className="space-y-2">
                <Label htmlFor={`notes-${draft.draftId}`} className="font-ui">
                  Anything else you noticed?
                </Label>
                <Textarea
                  id={`notes-${draft.draftId}`}
                  value={draft.notes}
                  onChange={(event) =>
                    updateDraft({
                      ...draft,
                      notes: event.target.value,
                    })
                  }
                  placeholder={
                    draft.isCustom
                      ? "Add any extra context that stands out."
                      : `What did the ${draft.name.toLowerCase()} feel like, and what made it stand out?`
                  }
                  rows={3}
                />
              </div>

              <div className="rounded-lg border border-border bg-background-soft p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-ui font-medium text-foreground">
                      Need help describing this?
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Use a few guided prompts and we will turn them into structured notes on save.
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setGuidedPromptsOpen((current) => !current)}
                  >
                    <MessageSquareMore className="h-4 w-4" />
                    {guidedPromptsOpen ? "Hide prompts" : "Open prompts"}
                  </Button>
                </div>

                {guidedPromptsOpen && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor={`duration-${draft.draftId}`}>How long has this been happening?</Label>
                      <Input
                        id={`duration-${draft.draftId}`}
                        value={draft.guidance.duration}
                        onChange={(event) =>
                          updateDraft({
                            ...draft,
                            guidance: {
                              ...draft.guidance,
                              duration: event.target.value,
                            },
                          })
                        }
                        placeholder="2 hours, since yesterday, on and off"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`location-${draft.draftId}`}>Where do you feel it?</Label>
                      <Input
                        id={`location-${draft.draftId}`}
                        value={draft.guidance.location}
                        onChange={(event) =>
                          updateDraft({
                            ...draft,
                            guidance: {
                              ...draft.guidance,
                              location: event.target.value,
                            },
                          })
                        }
                        placeholder="Forehead, chest, lower back"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`triggers-${draft.draftId}`}>What makes it better or worse?</Label>
                      <Input
                        id={`triggers-${draft.draftId}`}
                        value={draft.guidance.triggers}
                        onChange={(event) =>
                          updateDraft({
                            ...draft,
                            guidance: {
                              ...draft.guidance,
                              triggers: event.target.value,
                            },
                          })
                        }
                        placeholder="Rest helps, walking makes it worse"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`impact-${draft.draftId}`}>How is it affecting your day?</Label>
                      <Input
                        id={`impact-${draft.draftId}`}
                        value={draft.guidance.impact}
                        onChange={(event) =>
                          updateDraft({
                            ...draft,
                            guidance: {
                              ...draft.guidance,
                              impact: event.target.value,
                            },
                          })
                        }
                        placeholder="Hard to sleep, slowing work down"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor={`related-${draft.draftId}`}>Any related symptoms?</Label>
                      <Input
                        id={`related-${draft.draftId}`}
                        value={draft.guidance.relatedSymptoms}
                        onChange={(event) =>
                          updateDraft({
                            ...draft,
                            guidance: {
                              ...draft.guidance,
                              relatedSymptoms: event.target.value,
                            },
                          })
                        }
                        placeholder="Nausea, dizziness, fatigue"
                      />
                    </div>
                  </div>
                )}
              </div>

              {combinedNotes && (
                <div className="rounded-lg border border-border bg-background p-4">
                  <div className="mb-2 text-xs font-ui uppercase tracking-wide text-muted-foreground">
                    Saved note preview
                  </div>
                  <p className="whitespace-pre-line text-sm text-foreground">
                    {combinedNotes}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
