export interface AuthTokenProvider {
  getToken: () => Promise<string | null> | string | null;
}

export const NullAuthTokenProvider: AuthTokenProvider = {
  getToken: () => null
};
