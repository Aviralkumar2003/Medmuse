import { Calendar as CalendarIcon, Clock as ClockIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatDateInputValue } from "@/lib/symptom-entry-utils";

interface DateTimePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  time: string;
  onTimeChange: (time: string) => void;
  label?: {
    date?: string;
    time?: string;
  };
}

export function DateTimePicker({
  date,
  onDateChange,
  time,
  onTimeChange,
  label = { date: "Date", time: "Time" }
}: DateTimePickerProps) {
  const dateValue = formatDateInputValue(date);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="date" className="font-ui">
          {label.date}
        </Label>
        <div className="relative">
          <Input
            id="date"
            type="date"
            value={dateValue}
            onChange={(event) => {
              const nextDate = event.target.value;
              if (!nextDate) {
                return;
              }

              const [year, month, day] = nextDate.split("-").map(Number);
              onDateChange(new Date(year, month - 1, day));
            }}
            className="h-12 pl-10"
          />
          <CalendarIcon className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="time" className="font-ui">
          {label.time}
        </Label>
        <div className="relative">
          <Input
            id="time"
            type="time"
            step="60"
            value={time}
            onChange={(event) => onTimeChange(event.target.value)}
            className="h-12 pl-10"
          />
          <ClockIcon className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
