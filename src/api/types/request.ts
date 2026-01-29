export interface RequestDTO {
  id?: string;
  title?: string;
  link?: string;
  reason?: string;
  notes?: string;
  status?: string;
  createdAt?: string;
  requestedAt?: string;
  posterUrl?: string;
  movie?: { imdbUrl?: string | null } | null;
}

export interface CreateRequestBodyDTO {
  title: string;
  notes: string;
  posterUrl?: string;
}
