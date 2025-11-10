export const auth0Config = {
  domain: 'dev-ksd1hbcay1mfvjjg.us.auth0.com',
  clientId: 'NH5dRW1Gvcv0GeZDNzmNnsa0eCcp4799',
  audience: 'https://nexosdi.synapxix.api',
  scope: 'openid profile email',
  api: {
    baseUrl: 'http://localhost:3000/api',
  },
  issuer: 'https://dev-ksd1hbcay1mfvjjg.us.auth0.com/',
} as const;

export type Auth0Config = typeof auth0Config;
