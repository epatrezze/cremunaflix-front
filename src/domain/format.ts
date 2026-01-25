/**
 * Formats a date-time string in pt-BR with date and time.
 *
 * @param value - ISO date or date-time string.
 * @returns Localized date-time label.
 */
export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));

/**
 * Formats a date string in pt-BR with weekday and day.
 *
 * @param value - ISO date or date-time string.
 * @returns Localized date label.
 */
export const formatDay = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(new Date(value));
