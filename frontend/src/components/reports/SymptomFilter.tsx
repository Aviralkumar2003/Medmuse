import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Symptom {
  id: string | number;
  name: string;
}

interface SymptomFilterProps {
  symptoms: Symptom[];
  selectedSymptoms: string[];
  onSymptomToggle: (symptom: string) => void;
  onClearAll: () => void;
  maxDisplay?: number;
}

export function SymptomFilter({
  symptoms,
  selectedSymptoms,
  onSymptomToggle,
  onClearAll,
  maxDisplay = 12,
}: SymptomFilterProps) {
  return (
    <Card className="shadow-card border-border">
      <CardHeader>
        <CardTitle className="font-ui text-foreground">Filter by Symptoms</CardTitle>
        <CardDescription className="font-body">
          Select specific symptoms to include (leave empty for all)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {symptoms.slice(0, maxDisplay).map((symptom) => (
            <div key={symptom.id} className="flex items-center space-x-2">
              <Checkbox
                id={symptom.name}
                checked={selectedSymptoms.includes(symptom.name)}
                onCheckedChange={() => onSymptomToggle(symptom.name)}
              />
              <Label
                htmlFor={symptom.name}
                className="text-sm font-body cursor-pointer"
              >
                {symptom.name}
              </Label>
            </div>
          ))}
        </div>
        {selectedSymptoms.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm font-body text-muted-foreground">
              Selected: {selectedSymptoms.join(", ")}
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