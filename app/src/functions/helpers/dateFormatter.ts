// src/functions/helpers/dateFormatter.ts

/**
 * Formats a date as dd/mm/yyyy.
 * @param date Date object or date string
 * @returns string in dd/mm/yyyy format, or empty string if invalid
 */
export function formatDateDMY(date?: Date | string | null): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (!(d instanceof Date) || isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
