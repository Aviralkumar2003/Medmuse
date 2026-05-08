import { differenceInCalendarDays, format, parseISO, subDays } from "date-fns";

export function formatLocalDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function parseLocalDate(value: string): Date {
  return parseISO(value);
}

export function formatDisplayDate(value: string): string {
  return format(parseLocalDate(value), "M/d/yyyy");
}

export function getPresetDateRange(days: number): { start: string; end: string } {
  const end = new Date();

  return {
    start: formatLocalDate(subDays(end, days - 1)),
    end: formatLocalDate(end),
  };
}

export function inclusiveDayCount(startDate: string, endDate: string): number {
  return differenceInCalendarDays(parseLocalDate(endDate), parseLocalDate(startDate)) + 1;
}
