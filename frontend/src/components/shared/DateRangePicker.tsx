import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import Calendar from '@/components/ui/calendar';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  label?: {
    start?: string;
    end?: string;
  };
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  label = { start: 'Start Date', end: 'End Date' }
}: DateRangePickerProps) {
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  const startCalendarRef = useRef<HTMLDivElement>(null);
  const endCalendarRef = useRef<HTMLDivElement>(null);

  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (startCalendarRef.current && !startCalendarRef.current.contains(event.target as Node)) {
        setShowStartCalendar(false);
      }
      if (endCalendarRef.current && !endCalendarRef.current.contains(event.target as Node)) {
        setShowEndCalendar(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Start Date Picker */}
      <div className="space-y-2 relative" ref={startCalendarRef}>
        <Label htmlFor="startDate" className="font-ui">
          {label.start}
        </Label>
        <input
          readOnly
          id="startDate"
          value={startDateObj.toLocaleDateString('en-US')}
          onClick={() => setShowStartCalendar(v => !v)}
          className="pl-10 font-body cursor-pointer w-full border border-gray-300 rounded-md h-10"
        />
        <CalendarIcon className="absolute left-3 top-[38px] h-4 w-4 text-muted-foreground pointer-events-none" />
        {showStartCalendar && (
          <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-md">
            <Calendar
              selected={startDateObj}
              onSelect={(d) => {
                if (d && d <= endDateObj) {
                  onStartDateChange(d.toISOString().split('T')[0]);
                  setShowStartCalendar(false);
                }
              }}
            />
          </div>
        )}
      </div>

      {/* End Date Picker */}
      <div className="space-y-2 relative" ref={endCalendarRef}>
        <Label htmlFor="endDate" className="font-ui">
          {label.end}
        </Label>
        <input
          readOnly
          id="endDate"
          value={endDateObj.toLocaleDateString('en-US')}
          onClick={() => setShowEndCalendar(v => !v)}
          className="pl-10 font-body cursor-pointer w-full border border-gray-300 rounded-md h-10"
        />
        <CalendarIcon className="absolute left-3 top-[38px] h-4 w-4 text-muted-foreground pointer-events-none" />
        {showEndCalendar && (
          <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-md">
            <Calendar
              selected={endDateObj}
              onSelect={(d) => {
                if (d && d >= startDateObj) {
                  onEndDateChange(d.toISOString().split('T')[0]);
                  setShowEndCalendar(false);
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}