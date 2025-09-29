import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, Clock as ClockIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import Calendar from "@/components/ui/calendar";

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
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [hours, setHours] = useState<number>(
    parseInt(time.split(":")[0], 10)
  );
  const [minutes, setMinutes] = useState<number>(
    parseInt(time.split(":")[1], 10)
  );

  const calendarRef = useRef<HTMLDivElement>(null);
  const timePickerRef = useRef<HTMLDivElement>(null);

  // Sync state if time changes
  useEffect(() => {
    const [h, m] = time.split(":").map(Number);
    setHours(h);
    setMinutes(m);
  }, [time]);

  // Close calendar and time picker on outside clicks
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

  // Confirm time selection
  const confirmTime = (h: number, m: number) => {
    setHours(h);
    setMinutes(m);
    const newTime = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    onTimeChange(newTime);
    setShowTimePicker(false);
  };

  const formattedDate = date.toLocaleDateString("en-US");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Date Picker */}
      <div className="space-y-2 relative" ref={calendarRef}>
        <Label htmlFor="date" className="font-ui">
          {label.date}
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
                  onDateChange(d);
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
          {label.time}
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
  );
}