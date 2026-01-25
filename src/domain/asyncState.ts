import type { ApiError } from '../contracts';

export interface AsyncState<T> {
  loading: boolean;
  data: T | null;
  error: ApiError | null;
}

export const createAsyncState = <T>(data: T | null = null): AsyncState<T> => ({
  loading: false,
  data,
  error: null
});
