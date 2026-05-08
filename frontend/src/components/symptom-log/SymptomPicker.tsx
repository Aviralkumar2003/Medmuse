import { useDeferredValue, useState } from "react";
import {
  Clock3,
  Plus,
  Search,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Symptom } from "@/services/symptomService";

interface SymptomPickerProps {
  availableSymptoms: Symptom[];
  recentSymptoms: Symptom[];
  selectedNamedSymptomIds: number[];
  isLoading?: boolean;
  onAddSymptom: (symptom: Symptom) => void;
  onAddCustomSymptom: () => void;
}

export function SymptomPicker({
  availableSymptoms,
  recentSymptoms,
  selectedNamedSymptomIds,
  isLoading = false,
  onAddSymptom,
  onAddCustomSymptom,
}: SymptomPickerProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const categories = [
    "All",
    ...new Set(availableSymptoms.map((symptom) => symptom.category)),
  ];

  const visibleSymptoms = availableSymptoms
    .filter((symptom) => {
      if (activeCategory === "All") {
        return true;
      }

      return symptom.category === activeCategory;
    })
    .filter((symptom) => {
      if (!deferredQuery) {
        return true;
      }

      const symptomName = symptom.name.toLowerCase();
      const symptomDescription = symptom.description?.toLowerCase() || "";
      return (
        symptomName.includes(deferredQuery) ||
        symptomDescription.includes(deferredQuery)
      );
    })
    .sort((left, right) => {
      const leftStartsWith =
        deferredQuery && left.name.toLowerCase().startsWith(deferredQuery);
      const rightStartsWith =
        deferredQuery && right.name.toLowerCase().startsWith(deferredQuery);

      if (leftStartsWith && !rightStartsWith) {
        return -1;
      }
      if (!leftStartsWith && rightStartsWith) {
        return 1;
      }

      return left.name.localeCompare(right.name);
    })
    .slice(0, deferredQuery ? 10 : 12);

  const topMatch = visibleSymptoms.find(
    (symptom) => !selectedNamedSymptomIds.includes(symptom.id)
  );

  const handleAddSymptom = (symptom: Symptom) => {
    onAddSymptom(symptom);
    setQuery("");
  };

  return (
    <Card className="border-border shadow-card">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="font-ui text-xl text-foreground">
              Add Symptoms
            </CardTitle>
            <CardDescription className="font-body">
              Search for a known symptom, or choose the custom option when you
              only know how it feels.
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/5 text-primary"
          >
            <Sparkles className="h-3 w-3" />
            One flow
          </Badge>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && topMatch) {
                event.preventDefault();
                handleAddSymptom(topMatch);
              }
            }}
            placeholder="Search symptoms like headache, nausea, or cough"
            className="h-12 pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={onAddCustomSymptom}
            className="border-primary/40 bg-primary/5 text-primary hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
          >
            <Plus className="h-3.5 w-3.5" />
            Custom symptom
          </Button>

          {categories.map((category) => (
            <Button
              key={category}
              type="button"
              variant={activeCategory === category ? "medical" : "soft"}
              size="xs"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <button
          type="button"
          onClick={onAddCustomSymptom}
          className="w-full rounded-xl border border-dashed border-primary/35 bg-primary/5 p-4 text-left transition-medical hover:border-primary/50 hover:bg-primary/10"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-ui font-medium text-foreground">
                Describe it yourself
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Skip the symptom name and log what you feel, how strong it is,
                where it happens, and what affects it.
              </div>
            </div>
            <Badge className="border-primary/20 bg-background text-primary">
              Custom
            </Badge>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-primary">
            <span>Add a custom symptom</span>
            <Plus className="h-3.5 w-3.5" />
          </div>
        </button>

        {recentSymptoms.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-ui text-foreground">
              <Clock3 className="h-4 w-4 text-primary" />
              Recent symptoms
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSymptoms.map((symptom) => {
                const alreadyAdded = selectedNamedSymptomIds.includes(
                  symptom.id
                );

                return (
                  <Button
                    key={symptom.id}
                    type="button"
                    variant="outline"
                    size="xs"
                    disabled={alreadyAdded}
                    onClick={() => handleAddSymptom(symptom)}
                    className="justify-start"
                  >
                    {symptom.name}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-ui text-foreground">
              {deferredQuery
                ? `Matches for "${query.trim()}"`
                : activeCategory === "All"
                  ? "Suggested symptoms"
                  : `${activeCategory} symptoms`}
            </p>
            {topMatch && (
              <p className="text-xs text-muted-foreground">
                Press Enter to add{" "}
                <span className="font-ui">{topMatch.name}</span>
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Loading symptoms...
            </div>
          ) : visibleSymptoms.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              <Stethoscope className="mx-auto mb-2 h-5 w-5 opacity-60" />
              No symptoms matched that search.
              <div className="mt-1 text-xs">
                Try another keyword, switch the category filter, or use the
                custom symptom option above.
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {visibleSymptoms.map((symptom) => {
                const alreadyAdded = selectedNamedSymptomIds.includes(
                  symptom.id
                );

                return (
                  <button
                    key={symptom.id}
                    type="button"
                    disabled={alreadyAdded}
                    onClick={() => handleAddSymptom(symptom)}
                    className={cn(
                      "rounded-lg border p-4 text-left transition-medical",
                      alreadyAdded
                        ? "cursor-not-allowed border-border bg-background-soft opacity-60"
                        : "border-border bg-background hover:border-primary/40 hover:shadow-card"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-ui font-medium text-foreground">
                          {symptom.name}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {symptom.description}
                        </div>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-[11px]">
                        {symptom.category}
                      </Badge>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">
                        {alreadyAdded ? "Already in this log" : "Add to log"}
                      </span>
                      {!alreadyAdded && (
                        <Plus className="h-3.5 w-3.5 text-primary" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
