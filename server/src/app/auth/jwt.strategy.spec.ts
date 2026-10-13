import { getKeycloakJwtConfig } from './jwt.strategy';

describe('getKeycloakJwtConfig', () => {
  it('defaults the expected issuer to the configured realm URL', () => {
    expect(getKeycloakJwtConfig({ KEYCLOAK_REALM_URL: 'http://keycloak:8080/realms/Synapxix' })).toEqual({
      jwksUri: 'http://keycloak:8080/realms/Synapxix/protocol/openid-connect/certs',
      issuer: 'http://keycloak:8080/realms/Synapxix',
    });
  });

  it('allows public issuer validation without changing the internal JWKS URL', () => {
    expect(getKeycloakJwtConfig({
      KEYCLOAK_REALM_URL: 'http://keycloak:8080/realms/Synapxix',
      KEYCLOAK_EXPECTED_ISSUER: 'http://localhost:8081/realms/Synapxix',
    })).toEqual({
      jwksUri: 'http://keycloak:8080/realms/Synapxix/protocol/openid-connect/certs',
      issuer: 'http://localhost:8081/realms/Synapxix',
    });
  });
});
