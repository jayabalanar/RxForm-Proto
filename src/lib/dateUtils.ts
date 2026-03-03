import { format } from "date-fns";

/**
 * Returns current date/time as ISO 8601 UTC string (e.g. "2025-03-03T12:30:00.000Z").
 * Use for timestamps like lastUpdatedAt so storage and parsing are timezone-safe.
 */
export function nowToISO(): string {
  return new Date().toISOString();
}

/**
 * Converts a Date to ISO 8601 UTC string. Use for timestamps.
 */
export function dateToISO(date: Date): string {
  return date.toISOString();
}

/**
 * Converts a date to "yyyy-MM-dd" (local calendar date). Use for date-only fields
 * (appointmentDate, dob) so the calendar day is preserved across timezones.
 */
export function toISODateString(date: Date | string | null | undefined): string | null {
  if (date == null) return null;
  const d = typeof date === "string" ? parseDateSafe(date) : date;
  if (!d || isNaN(d.getTime())) return null;
  return format(d, "yyyy-MM-dd");
}

/**
 * Parses a date value from API/storage. Handles:
 * - "yyyy-MM-dd" (date-only) → parsed as local midnight so the calendar day is correct
 * - ISO 8601 with time (e.g. "2025-03-03T12:00:00.000Z") → parsed correctly in UTC then displayed in local
 * - Existing locale strings → new Date(str) for backward compatibility
 */
export function parseDateSafe(
  value: string | Date | null | undefined
): Date | null {
  if (value == null) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  const str = String(value).trim();
  if (!str) return null;
  // Date-only (yyyy-MM-dd): parse as local date so the displayed day doesn't shift
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str);
  if (dateOnlyMatch) {
    const [, y, m, d] = dateOnlyMatch.map(Number);
    const local = new Date(y, m - 1, d);
    return isNaN(local.getTime()) ? null : local;
  }
  const parsed = new Date(str);
  return isNaN(parsed.getTime()) ? null : parsed;
}
