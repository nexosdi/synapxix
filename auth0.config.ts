// Testing credentials
export const auth0Config = {
  domain: '',
  clientId: '',
  audience: '',
  scope: '',
  api: {
    baseUrl: '',
  },
  issuer: '',
} as const;

export type Auth0Config = typeof auth0Config;
