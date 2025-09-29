import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getAllSymptoms, clearError } from "@/store/slices/symptomSlice";
import { createSymptomEntries } from "@/store/slices/symptomEntrySlice";
import { Activity, ClockIcon, MessageSquare, Brain } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { QuickLogging } from "@/components/ui/quick-logging";
import { DetailedLogging } from "@/components/ui/detailed-logging";
import { SymptomList, UnifiedSymptom } from "@/components/ui/symptom-list";
import { DateTimePicker } from "@/components/shared/DateTimePicker";
import { PageHeader } from "@/components/shared/PageHeader";
import { QuickTips } from "@/components/shared/QuickTips";

export default function LogSymptoms() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { symptoms: availableSymptoms } = useAppSelector(
    (state) => state.symptoms
  );
  const { isCreating: entryLoading, error } = useAppSelector(
    (state) => state.symptomEntries
  );

  // States
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5)); // "HH:mm"

  const [symptoms, setSymptoms] = useState<UnifiedSymptom[]>([]);
  const [selectedSymptomId, setSelectedSymptomId] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("quick");

  // Format date for display and ISO for backend
  const formattedDate = date.toLocaleDateString("en-US");
  const formattedDateISO = date.toISOString().split("T")[0];


  useEffect(() => {
    dispatch(getAllSymptoms());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  // Symptom handlers
  const handleSymptomAdd = (symptom: UnifiedSymptom) => {
    setSymptoms((prev) => [...prev, symptom]);
  };

  const handleSymptomUpdate = (updatedSymptom: UnifiedSymptom) => {
    setSymptoms((prev) =>
      prev.map((s) => (s.id === updatedSymptom.id ? updatedSymptom : s))
    );
  };

  const handleSymptomRemove = (symptomId: string) => {
    setSymptoms((prev) => prev.filter((s) => s.id !== symptomId));
    if (selectedSymptomId === symptomId) {
      setSelectedSymptomId(null);
    }
  };

  const handleSymptomClick = (symptom: UnifiedSymptom) => {
    setSelectedSymptomId(symptom.id);
    setActiveTab(symptom.loggingType);
  };

  const handleConvertSymptom = (
    symptom: UnifiedSymptom,
    newType: "quick" | "detailed"
  ) => {
    const updatedSymptom = { ...symptom, loggingType: newType };
    handleSymptomUpdate(updatedSymptom);
    setActiveTab(newType);
    toast({
      title: `Converted to ${newType === "quick" ? "Quick" : "Detailed"} Mode`,
      description: `${symptom.name} has been converted to ${newType} logging mode.`,
    });
  };


  // Save symptom entries
  const handleSaveAll = async () => {
    console.log(symptoms)
    if (symptoms.length === 0) {
      toast({
        title: "No Symptoms",
        description: "Please add at least one symptom before saving.",
        variant: "destructive",
      });
      return;
    }

    const entries = symptoms.map((symptom) => ({
      symptomId: parseInt(symptom.id),
      severity: symptom.severity,
      notes: symptom.notes,
      entryDate: formattedDateISO,
    }));

    try {
      await dispatch(createSymptomEntries({ entries })).unwrap();
      toast({
        title: "Success",
        description: `${symptoms.length} symptom${
          symptoms.length !== 1 ? "s" : ""
        } logged successfully!`,
      });
      navigate("/dashboard");
    } catch {
      // error handled in useEffect
    }
  };

  return (
    <div className="min-h-screen bg-background-soft">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <PageHeader
            title="Log Your Symptoms"
            description="Record how you're feeling today to track your health over time"
          />

          {/* Date and Time */}
          <Card className="shadow-card border-border mb-6">
            <CardHeader>
              <CardTitle className="font-ui text-foreground text-lg">
                Entry Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DateTimePicker
                date={date}
                onDateChange={setDate}
                time={time}
                onTimeChange={setTime}
              />
            </CardContent>
          </Card>

          

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
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
                onSymptomUpdate={handleSymptomUpdate}
                onSymptomAdd={handleSymptomAdd}
                onSymptomRemove={handleSymptomRemove}
                selectedSymptom={symptoms.find(
                  (s) => s.id === selectedSymptomId
                )}
                symptoms={symptoms}
                isLoading={entryLoading}
                date={formattedDateISO}
              />
            </TabsContent>

            <TabsContent value="detailed" className="space-y-6">
              <DetailedLogging
                availableSymptoms={availableSymptoms}
                onSymptomUpdate={handleSymptomUpdate}
                onSymptomAdd={handleSymptomAdd}
                onSymptomRemove={handleSymptomRemove}
                selectedSymptom={symptoms.find(
                  (s) => s.id === selectedSymptomId
                )}
                symptoms={symptoms}
                isLoading={entryLoading}
                date={formattedDateISO}
              />
            </TabsContent>
          </Tabs>

          {/* Symptom List */}
          <SymptomList
            symptoms={symptoms}
            onSymptomClick={handleSymptomClick}
            onRemoveSymptom={handleSymptomRemove}
            onConvertSymptom={handleConvertSymptom}
            selectedSymptomId={selectedSymptomId}
          />

          {/* Save Button */}
          {symptoms.length > 0 && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleSaveAll}
                disabled={entryLoading}
                size="lg"
                className="px-8"
              >
                {entryLoading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : null}
                {entryLoading
                  ? "Saving..."
                  : `Save All ${symptoms.length} Symptom${
                      symptoms.length !== 1 ? "s" : ""
                    }`}
              </Button>
            </div>
          )}

          {/* Quick Tips */}
          <QuickTips
            tips={[
              {
                icon: <Brain className="h-3 w-3 text-blue-500" />,
                text: "Be detailed about your symptoms and their effects"
              },
              {
                icon: <Activity className="h-3 w-3 text-green-500" />,
                text: "Note any patterns or triggers you observe"
              },
              {
                icon: <MessageSquare className="h-3 w-3 text-orange-500" />,
                text: "Add notes about what helps relieve symptoms"
              }
            ]}
          />
        </div>
      </main>
    </div>
  );
}
