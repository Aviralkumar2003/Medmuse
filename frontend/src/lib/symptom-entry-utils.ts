export function formatDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatTimeInputValue(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function combineEntryDateTime(
  entryDate: string,
  entryTime?: string,
  loggedAt?: string
): Date | null {
  if (loggedAt) {
    const parsedLoggedAt = new Date(loggedAt);
    if (!Number.isNaN(parsedLoggedAt.getTime())) {
      return parsedLoggedAt;
    }
  }

  if (!entryDate) {
    return null;
  }

  const parsedEntry = new Date(`${entryDate}T${entryTime || "00:00"}`);
  if (Number.isNaN(parsedEntry.getTime())) {
    return null;
  }

  return parsedEntry;
}

export function formatEntryDateLabel(
  entryDate: string,
  entryTime?: string,
  loggedAt?: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const parsedEntry = combineEntryDateTime(entryDate, entryTime, loggedAt);
  if (!parsedEntry) {
    return entryDate;
  }

  return parsedEntry.toLocaleDateString("en-US", options);
}

export function formatEntryTimeLabel(
  entryDate: string,
  entryTime?: string,
  loggedAt?: string
): string | null {
  const parsedEntry = combineEntryDateTime(entryDate, entryTime, loggedAt);
  if (!parsedEntry) {
    return null;
  }

  return parsedEntry.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}
