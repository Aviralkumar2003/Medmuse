import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock3,
  Plus,
  Save,
  Stethoscope,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  clearError as clearSymptomError,
  getAllSymptoms,
} from "@/store/slices/symptomSlice";
import {
  clearError as clearSymptomEntryError,
  createSymptomEntries,
} from "@/store/slices/symptomEntrySlice";
import { DateTimePicker } from "@/components/shared/DateTimePicker";
import { PageHeader } from "@/components/shared/PageHeader";
import { SymptomPicker } from "@/components/symptom-log/SymptomPicker";
import { SymptomDraftCard } from "@/components/symptom-log/SymptomDraftCard";
import {
  buildSymptomNotes,
  createCustomSymptomDraft,
  createSymptomDraft,
  getDraftSummaryLabel,
  SymptomDraft,
} from "@/components/symptom-log/model";
import {
  formatDateInputValue,
  formatEntryDateLabel,
  formatEntryTimeLabel,
  formatTimeInputValue,
} from "@/lib/symptom-entry-utils";
import { Symptom } from "@/services/symptomService";

const RECENT_SYMPTOMS_STORAGE_KEY = "medmuse.recent-symptoms";

function readRecentSymptomIds(): number[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(RECENT_SYMPTOMS_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value));
  } catch {
    return [];
  }
}

function writeRecentSymptomIds(symptomIds: number[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    RECENT_SYMPTOMS_STORAGE_KEY,
    JSON.stringify(symptomIds.slice(0, 8))
  );
}

function summarizeSymptomNames(drafts: SymptomDraft[]): string {
  if (drafts.length === 0) {
    return "";
  }

  const visibleNames = drafts.slice(0, 3).map(getDraftSummaryLabel);
  const hiddenCount = drafts.length - visibleNames.length;

  if (hiddenCount <= 0) {
    return visibleNames.join(", ");
  }

  return `${visibleNames.join(", ")} +${hiddenCount} more`;
}

type SaveMode = "stay" | "exit" | null;

export default function LogSymptoms() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    symptoms: availableSymptoms,
    isLoading: symptomsLoading,
    error: symptomError,
  } = useAppSelector((state) => state.symptoms);
  const { isCreating: entryLoading, error: entryError } = useAppSelector(
    (state) => state.symptomEntries
  );

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(formatTimeInputValue(new Date()));
  const [drafts, setDrafts] = useState<SymptomDraft[]>([]);
  const [recentSymptomIds, setRecentSymptomIds] = useState<number[]>([]);
  const [saveMode, setSaveMode] = useState<SaveMode>(null);

  useEffect(() => {
    setRecentSymptomIds(readRecentSymptomIds());
  }, []);

  useEffect(() => {
    writeRecentSymptomIds(recentSymptomIds);
  }, [recentSymptomIds]);

  useEffect(() => {
    if (!availableSymptoms || availableSymptoms.length === 0) {
      dispatch(getAllSymptoms());
    }

    return () => {
      dispatch(clearSymptomError());
      dispatch(clearSymptomEntryError());
    };
  }, [dispatch, availableSymptoms]);

  useEffect(() => {
    if (!symptomError) {
      return;
    }

    toast({
      title: "Could not load symptoms",
      description: symptomError,
      variant: "destructive",
    });
    dispatch(clearSymptomError());
  }, [dispatch, symptomError, toast]);

  useEffect(() => {
    if (!entryError) {
      return;
    }

    toast({
      title: "Could not save symptoms",
      description: entryError,
      variant: "destructive",
    });
    dispatch(clearSymptomEntryError());
    setSaveMode(null);
  }, [dispatch, entryError, toast]);

  const rememberRecentSymptom = (symptomId: number) => {
    setRecentSymptomIds((currentIds) => [
      symptomId,
      ...currentIds.filter((currentId) => currentId !== symptomId),
    ]);
  };

  const handleAddSymptom = (symptom: Symptom) => {
    setDrafts((currentDrafts) => {
      if (currentDrafts.some((draft) => draft.symptomId === symptom.id)) {
        return currentDrafts;
      }

      return [...currentDrafts, createSymptomDraft(symptom)];
    });

    rememberRecentSymptom(symptom.id);
  };

  const handleAddCustomSymptom = () => {
    setDrafts((currentDrafts) => [...currentDrafts, createCustomSymptomDraft()]);
  };

  const handleUpdateDraft = (draftId: string, nextDraft: SymptomDraft) => {
    setDrafts((currentDrafts) =>
      currentDrafts.map((draft) =>
        draft.draftId === draftId ? nextDraft : draft
      )
    );
  };

  const handleRemoveDraft = (draftId: string) => {
    setDrafts((currentDrafts) =>
      currentDrafts.filter((draft) => draft.draftId !== draftId)
    );
  };

  const handleUseCurrentTime = () => {
    const now = new Date();
    setDate(now);
    setTime(formatTimeInputValue(now));
  };

  const handleSave = async (mode: Exclude<SaveMode, null>) => {
    if (drafts.length === 0) {
      toast({
        title: "No symptoms added yet",
        description: "Start by adding at least one symptom to this log.",
        variant: "destructive",
      });
      return;
    }

    const missingCustomDescription = drafts.find(
      (draft) => draft.isCustom && !draft.customDescription.trim()
    );

    if (missingCustomDescription) {
      toast({
        title: "Describe the custom symptom first",
        description:
          "Custom symptoms need a short description of what you are feeling before they can be saved.",
        variant: "destructive",
      });
      return;
    }

    const entryDate = formatDateInputValue(date);
    const entries = drafts.map((draft) => {
      const baseEntry = {
        severity: draft.severity,
        notes: buildSymptomNotes(draft) || undefined,
        entryDate,
        entryTime: time,
      };

      if (draft.symptomId != null) {
        return {
          ...baseEntry,
          symptomId: draft.symptomId,
        };
      }

      return {
        ...baseEntry,
        customDescription: draft.customDescription.trim(),
      };
    });

    setSaveMode(mode);

    try {
      await dispatch(createSymptomEntries({ entries })).unwrap();

      toast({
        title: "Symptoms logged",
        description: `${drafts.length} symptom${
          drafts.length === 1 ? "" : "s"
        } saved for ${formatEntryDateLabel(entryDate, time, undefined, {
          month: "short",
          day: "numeric",
        })} at ${formatEntryTimeLabel(entryDate, time)}`,
      });

      drafts.forEach((draft) => {
        if (draft.symptomId != null) {
          rememberRecentSymptom(draft.symptomId);
        }
      });

      if (mode === "stay") {
        setDrafts([]);
        setSaveMode(null);
        return;
      }

      navigate("/dashboard");
    } catch {
      setSaveMode(null);
    }
  };

  const recentSymptoms = recentSymptomIds
    .map((symptomId) =>
      availableSymptoms.find((symptom) => symptom.id === symptomId)
    )
    .filter((symptom): symptom is Symptom => Boolean(symptom));

  const selectedNamedSymptomIds = drafts.flatMap((draft) =>
    draft.symptomId != null ? [draft.symptomId] : []
  );
  const averageSeverity =
    drafts.length > 0
      ? Math.round(
          drafts.reduce((total, draft) => total + draft.severity, 0) /
            drafts.length
        )
      : 0;
  const currentEntryDate = formatDateInputValue(date);
  const currentEntryDateLabel = formatEntryDateLabel(
    currentEntryDate,
    time,
    undefined,
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
  const currentEntryTimeLabel = formatEntryTimeLabel(currentEntryDate, time);

  return (
    <div className="min-h-screen bg-background-soft">
      <main
        className={`container mx-auto px-4 py-8 ${
          drafts.length > 0 ? "pb-36" : ""
        }`}
      >
        <div className="mx-auto max-w-5xl space-y-8">
          <PageHeader
            title="Log Symptoms"
            description="Add what you felt, choose the right severity, and use a custom symptom whenever you do not know the name."
          />

          <Card className="shadow-card border-border">
            <CardHeader className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="font-ui text-foreground text-xl">
                    When did this happen?
                  </CardTitle>
                  <CardDescription className="font-body">
                    We now save both the date and the time for this symptom log.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleUseCurrentTime}
                >
                  <Clock3 className="h-4 w-4" />
                  Use current time
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <DateTimePicker
                date={date}
                onDateChange={setDate}
                time={time}
                onTimeChange={setTime}
                label={{
                  date: "Date",
                  time: "Time",
                }}
              />

              <div className="rounded-lg border border-border bg-background-soft p-3 text-sm text-muted-foreground">
                Saving this log for{" "}
                <span className="font-ui text-foreground">
                  {currentEntryDateLabel}
                </span>
                {currentEntryTimeLabel ? ` at ${currentEntryTimeLabel}` : ""}.
              </div>
            </CardContent>
          </Card>

          <SymptomPicker
            availableSymptoms={availableSymptoms}
            recentSymptoms={recentSymptoms}
            selectedNamedSymptomIds={selectedNamedSymptomIds}
            isLoading={symptomsLoading}
            onAddSymptom={handleAddSymptom}
            onAddCustomSymptom={handleAddCustomSymptom}
          />

          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-ui text-2xl font-semibold text-foreground">
                  Symptoms in This Log
                </h2>
                <p className="text-muted-foreground">
                  Keep each symptom compact, then open details only when you need more context.
                </p>
              </div>

              {drafts.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-primary/20 bg-primary/5 text-primary">
                    {drafts.length} ready to save
                  </Badge>
                  <Badge variant="outline">Average severity {averageSeverity}/10</Badge>
                </div>
              )}
            </div>

            {drafts.length === 0 ? (
              <Card className="border-dashed border-border bg-background shadow-card">
                <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                  <Stethoscope className="h-8 w-8 text-primary/70" />
                  <div className="space-y-1">
                    <p className="font-ui text-lg text-foreground">
                      No symptoms added yet
                    </p>
                    <p className="max-w-xl text-muted-foreground">
                      Search above to add a known symptom, or choose the custom option to describe what you feel in your own words.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {drafts.map((draft) => (
                  <SymptomDraftCard
                    key={draft.draftId}
                    draft={draft}
                    onUpdate={handleUpdateDraft}
                    onRemove={handleRemoveDraft}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {drafts.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-2xl border border-border bg-background p-4 shadow-dialog sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-secondary/20 bg-secondary/10 text-secondary">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {drafts.length} symptom{drafts.length === 1 ? "" : "s"} ready
                  </Badge>
                  <Badge variant="outline">{averageSeverity}/10 average severity</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-ui text-foreground">
                    {summarizeSymptomNames(drafts)}
                  </span>
                  {" | "}
                  {currentEntryDateLabel}
                  {currentEntryTimeLabel ? ` at ${currentEntryTimeLabel}` : ""}
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={entryLoading}
                  onClick={() => handleSave("stay")}
                >
                  <Plus className="h-4 w-4" />
                  {saveMode === "stay" && entryLoading
                    ? "Saving..."
                    : "Save and log another"}
                </Button>
                <Button
                  type="button"
                  variant="medical"
                  size="sm"
                  disabled={entryLoading}
                  onClick={() => handleSave("exit")}
                >
                  <Save className="h-4 w-4" />
                  {saveMode === "exit" && entryLoading
                    ? "Saving..."
                    : "Save and go to dashboard"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
