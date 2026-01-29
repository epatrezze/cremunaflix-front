/**
 * Formats a date-time string in pt-BR with date and time.
 *
 * @param value - ISO date or date-time string.
 * @returns Localized date-time label.
 */
const parseDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (value: string) => {
  const date = parseDate(value);
  if (!date) {
    return 'Data a definir';
  }
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};

/**
 * Formats a date string in pt-BR with weekday and day.
 *
 * @param value - ISO date or date-time string.
 * @returns Localized date label.
 */
export const formatDay = (value: string) => {
  const date = parseDate(value);
  if (!date) {
    return 'Data a definir';
  }
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(date);
};
