import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Symptom {
  id: string | number;
  name: string;
}

interface SymptomFilterProps {
  symptoms: Symptom[];
  selectedSymptomIds: number[];
  onSymptomToggle: (symptomId: number) => void;
  onClearAll: () => void;
}

export function SymptomFilter({
  symptoms,
  selectedSymptomIds,
  onSymptomToggle,
  onClearAll,
}: SymptomFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const orderedSymptoms = [...symptoms].sort((first, second) =>
    first.name.localeCompare(second.name)
  );
  const filteredSymptoms = orderedSymptoms.filter((symptom) =>
    symptom.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );
  const selectedSymptomNames = orderedSymptoms
    .filter((symptom) => selectedSymptomIds.includes(Number(symptom.id)))
    .map((symptom) => symptom.name);

  return (
    <Card className="shadow-card border-border">
      <CardHeader>
        <CardTitle className="font-ui text-foreground">Filter by Symptoms</CardTitle>
        <CardDescription className="font-body">
          Select specific symptoms to include (leave empty for all)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search symptoms..."
            aria-label="Search symptoms"
          />

          <ScrollArea className="h-64 pr-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredSymptoms.map((symptom) => {
                const symptomId = Number(symptom.id);
                const checkboxId = `report-symptom-${symptomId}`;

                return (
                  <div key={checkboxId} className="flex items-center space-x-2">
                    <Checkbox
                      id={checkboxId}
                      checked={selectedSymptomIds.includes(symptomId)}
                      onCheckedChange={() => onSymptomToggle(symptomId)}
                    />
                    <Label
                      htmlFor={checkboxId}
                      className="text-sm font-body cursor-pointer"
                    >
                      {symptom.name}
                    </Label>
                  </div>
                );
              })}
            </div>

            {filteredSymptoms.length === 0 && (
              <p className="text-sm font-body text-muted-foreground">
                No symptoms match your search.
              </p>
            )}
          </ScrollArea>
        </div>

        {selectedSymptomIds.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm font-body text-muted-foreground">
              Selected: {selectedSymptomNames.join(", ")}
            </p>
            <Button variant="ghost" size="sm" onClick={onClearAll} className="mt-2">
              Clear All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
