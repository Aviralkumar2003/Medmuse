import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateTimePicker } from "@/components/shared/DateTimePicker";

interface EntryDetailsProps {
  date: Date;
  onDateChange: (date: Date) => void;
  time: string;
  onTimeChange: (time: string) => void;
}

export function EntryDetails({
  date,
  onDateChange,
  time,
  onTimeChange,
}: EntryDetailsProps) {
  return (
    <Card className="shadow-card border-border mb-6">
      <CardHeader>
        <CardTitle className="font-ui text-foreground text-lg">
          Entry Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DateTimePicker
          date={date}
          onDateChange={onDateChange}
          time={time}
          onTimeChange={onTimeChange}
        />
      </CardContent>
    </Card>
  );
}