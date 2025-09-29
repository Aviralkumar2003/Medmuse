import { useEffect, useRef, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import Calendar from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangePickerProps) {
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  const startCalendarRef = useRef<HTMLDivElement>(null);
  const endCalendarRef = useRef<HTMLDivElement>(null);
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        startCalendarRef.current &&
        !startCalendarRef.current.contains(event.target as Node) &&
        startInputRef.current &&
        !startInputRef.current.contains(event.target as Node)
      ) {
        setShowStartCalendar(false);
      }
      if (
        endCalendarRef.current &&
        !endCalendarRef.current.contains(event.target as Node) &&
        endInputRef.current &&
        !endInputRef.current.contains(event.target as Node)
      ) {
        setShowEndCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatDisplayDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString("en-US");
  };

  return (
    <Card className="shadow-card border-border">
      <CardHeader>
        <CardTitle className="font-ui text-foreground">Custom Date Range</CardTitle>
        <CardDescription className="font-body">
          Select specific dates for your report
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Start Date */}
          <div className="space-y-2 relative" ref={startCalendarRef}>
            <Label htmlFor="start-date" className="font-ui">
              Start Date
            </Label>
            <input
              id="start-date"
              ref={startInputRef}
              readOnly
              type="text"
              value={formatDisplayDate(startDate)}
              onClick={() => setShowStartCalendar((v) => !v)}
              className="pl-10 font-body cursor-pointer w-full border border-gray-300 rounded-md h-10"
            />
            <CalendarIcon className="absolute left-3 top-[38px] h-4 w-4 text-muted-foreground pointer-events-none" />
            {showStartCalendar && (
              <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-md">
                <Calendar
                  selected={new Date(startDate)}
                  onSelect={(d) => {
                    if (d) {
                      onStartDateChange(d.toISOString().split("T")[0]);
                      setShowStartCalendar(false);
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* End Date */}
          <div className="space-y-2 relative" ref={endCalendarRef}>
            <Label htmlFor="end-date" className="font-ui">
              End Date
            </Label>
            <input
              id="end-date"
              ref={endInputRef}
              readOnly
              type="text"
              value={formatDisplayDate(endDate)}
              onClick={() => setShowEndCalendar((v) => !v)}
              className="pl-10 font-body cursor-pointer w-full border border-gray-300 rounded-md h-10"
            />
            <CalendarIcon className="absolute left-3 top-[38px] h-4 w-4 text-muted-foreground pointer-events-none" />
            {showEndCalendar && (
              <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-md">
                <Calendar
                  selected={new Date(endDate)}
                  onSelect={(d) => {
                    if (d) {
                      onEndDateChange(d.toISOString().split("T")[0]);
                      setShowEndCalendar(false);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}