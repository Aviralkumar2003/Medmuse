import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

type CalendarProps = {
  selected?: Date;
  onSelect?: (date?: Date) => void;
  disableFuture?: boolean; // optional toggle
};
 var currentYear = new Date().getFullYear(); 
 var currMonth = new Date().getMonth();

export default function Calendar({
  selected,
  onSelect,
  disableFuture = true,
}: CalendarProps) {
  return (
    <DayPicker
      mode="single"
      captionLayout="dropdown" 
      startMonth={new Date(2025, 7)}
      endMonth={new Date(currentYear, currMonth)}
      selected={selected}
      onSelect={onSelect}
      disabled={disableFuture ? { after: new Date() } : undefined}
    />
  );
}
