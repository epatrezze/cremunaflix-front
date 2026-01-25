export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));

export const formatDay = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(new Date(value));
