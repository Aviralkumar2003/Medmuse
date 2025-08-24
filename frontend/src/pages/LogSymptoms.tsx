import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getAllSymptoms, clearError } from "@/store/slices/symptomSlice";
import { createSymptomEntries } from "@/store/slices/symptomEntrySlice";
import {
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Activity,
  MessageSquare,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { QuickLogging } from "@/components/ui/quick-logging";
import { DetailedLogging } from "@/components/ui/detailed-logging";
import { SymptomList, UnifiedSymptom } from "@/components/ui/symptom-list";
import Calendar from "@/components/ui/calendar";

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
  const [showCalendar, setShowCalendar] = useState(false);

  // Time state and picker
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5)); // "HH:mm"
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [hours, setHours] = useState<number>(
    parseInt(time.split(":")[0], 10)
  );
  const [minutes, setMinutes] = useState<number>(
    parseInt(time.split(":")[1], 10)
  );

  const [symptoms, setSymptoms] = useState<UnifiedSymptom[]>([]);
  const [selectedSymptomId, setSelectedSymptomId] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("quick");

  // Format date for display and ISO for backend
  const formattedDate = date.toLocaleDateString("en-US");
  const formattedDateISO = date.toISOString().split("T")[0];

  // Sync state if time changes
  useEffect(() => {
    const [h, m] = time.split(":").map(Number);
    setHours(h);
    setMinutes(m);
  }, [time]);

  // Close calendar and time picker on outside clicks
  const calendarRef = useRef<HTMLDivElement>(null);
  const timePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
      if (
        timePickerRef.current &&
        !timePickerRef.current.contains(event.target as Node)
      ) {
        setShowTimePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  // Confirm time selection
  const confirmTime = (h: number, m: number) => {
    setHours(h);
    setMinutes(m);
    setTime(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    setShowTimePicker(false);
  };

  // Save symptom entries
  const handleSaveAll = async () => {
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
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-ui font-bold text-foreground mb-2">
              Log Your Symptoms
            </h1>
            <p className="text-lg font-body text-muted-foreground">
              Record how you're feeling today to track your health over time
            </p>
          </div>

          {/* Date and Time */}
          <Card className="shadow-card border-border mb-6">
            <CardHeader>
              <CardTitle className="font-ui text-foreground text-lg">
                Entry Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date Picker */}
                <div className="space-y-2 relative" ref={calendarRef}>
                  <Label htmlFor="date" className="font-ui">
                    Date
                  </Label>
                  <input
                    readOnly
                    id="date"
                    value={formattedDate}
                    onClick={() => setShowCalendar((v) => !v)}
                    className="pl-10 font-body cursor-pointer w-full border border-gray-300 rounded-md h-10"
                  />
                  <CalendarIcon className="absolute left-3 top-[38px] h-4 w-4 text-muted-foreground pointer-events-none" />
                  {showCalendar && (
                    <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-md">
                      <Calendar
                        selected={date}
                        onSelect={(d) => {
                          if (d) {
                            setDate(d);
                            setShowCalendar(false);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Time Picker */}
                <div className="space-y-2 relative" ref={timePickerRef}>
                  <Label htmlFor="time" className="font-ui">
                    Time
                  </Label>
                  <input
                    readOnly
                    id="time"
                    value={time}
                    onClick={() => setShowTimePicker((v) => !v)}
                    className="pl-10 font-body cursor-pointer w-full border border-gray-300 rounded-md h-10"
                  />
                  <ClockIcon className="absolute left-3 top-[38px] h-4 w-4 text-muted-foreground pointer-events-none" />

                  {showTimePicker && (
                    <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-md p-3 grid grid-cols-2 gap-3 w-48">
                      {/* Hours */}
                      <div className="max-h-40 overflow-y-auto pr-1">
                        {[...Array(24)].map((_, h) => (
                          <button
                            key={h}
                            className={`w-full text-left px-2 py-1 rounded ${
                              h === hours
                                ? "bg-primary text-white"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() => confirmTime(h, minutes)}
                          >
                            {String(h).padStart(2, "0")}
                          </button>
                        ))}
                      </div>

                      {/* Minutes */}
                      <div className="max-h-40 overflow-y-auto pl-1">
                        {[...Array(60)].map((_, m) => (
                          <button
                            key={m}
                            className={`w-full text-left px-2 py-1 rounded ${
                              m === minutes
                                ? "bg-primary text-white"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() => confirmTime(hours, m)}
                          >
                            {String(m).padStart(2, "0")}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Symptom List */}
          <SymptomList
            symptoms={symptoms}
            onSymptomClick={handleSymptomClick}
            onRemoveSymptom={handleSymptomRemove}
            onConvertSymptom={handleConvertSymptom}
            selectedSymptomId={selectedSymptomId}
          />

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
          <Card className="shadow-card border-border mt-6">
            <CardHeader>
              <CardTitle className="font-ui text-foreground text-lg">
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-3 w-3 text-blue-500" />
                  <span>Be specific about location and timing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-3 w-3 text-green-500" />
                  <span>Note what makes it better or worse</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-3 w-3 text-orange-500" />
                  <span>Log symptoms as soon as you notice them</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
