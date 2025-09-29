import { Activity, Clock as ClockIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { QuickLogging } from "@/components/ui/quick-logging";
import { DetailedLogging } from "@/components/ui/detailed-logging";
import { UnifiedSymptom } from "@/components/ui/symptom-list";

interface SymptomLogTabsProps {
  activeTab: "quick" | "detailed";
  onTabChange: (value: "quick" | "detailed") => void;
  availableSymptoms: any[]; // Replace with proper type from your symptom slice
  symptoms: UnifiedSymptom[];
  selectedSymptomId: string | null;
  date: string;
  isLoading: boolean;
  onSymptomUpdate: (symptom: UnifiedSymptom) => void;
  onSymptomAdd: (symptom: UnifiedSymptom) => void;
  onSymptomRemove: (symptomId: string) => void;
}

export function SymptomLogTabs({
  activeTab,
  onTabChange,
  availableSymptoms,
  symptoms,
  selectedSymptomId,
  date,
  isLoading,
  onSymptomUpdate,
  onSymptomAdd,
  onSymptomRemove,
}: SymptomLogTabsProps) {
  const selectedSymptom = symptoms.find((s) => s.id === selectedSymptomId);

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger
          value="quick"
          className="flex items-center gap-2 data-[state=active]:border-2 data-[state=active]:border-primary"
        >
          <ClockIcon className="h-4 w-4" />
          Quick Logging
        </TabsTrigger>
        <TabsTrigger
          value="detailed"
          className="flex items-center gap-2 data-[state=active]:border-2 data-[state=active]:border-primary"
        >
          <Activity className="h-4 w-4" />
          Detailed Logging
        </TabsTrigger>
      </TabsList>

      <TabsContent value="quick" className="space-y-6">
        <QuickLogging
          availableSymptoms={availableSymptoms}
          onSymptomUpdate={onSymptomUpdate}
          onSymptomAdd={onSymptomAdd}
          onSymptomRemove={onSymptomRemove}
          selectedSymptom={selectedSymptom}
          symptoms={symptoms}
          isLoading={isLoading}
          date={date}
        />
      </TabsContent>

      <TabsContent value="detailed" className="space-y-6">
        <DetailedLogging
          availableSymptoms={availableSymptoms}
          onSymptomUpdate={onSymptomUpdate}
          onSymptomAdd={onSymptomAdd}
          onSymptomRemove={onSymptomRemove}
          selectedSymptom={selectedSymptom}
          symptoms={symptoms}
          isLoading={isLoading}
          date={date}
        />
      </TabsContent>
    </Tabs>
  );
}