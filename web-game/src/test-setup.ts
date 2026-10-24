(globalThis as Record<string, unknown>)['ngJest'] = {
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
};

import 'jest-preset-angular/setup-env/zone';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = jest.fn().mockImplementation((contextId: string) => {
    if (contextId === '2d') {
      return {
        clearRect: jest.fn(),
        fillRect: jest.fn(),
        getImageData: jest.fn(),
        putImageData: jest.fn(),
        createImageData: jest.fn(),
        setTransform: jest.fn(),
        drawImage: jest.fn(),
        save: jest.fn(),
        fillText: jest.fn(),
        restore: jest.fn(),
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        closePath: jest.fn(),
        stroke: jest.fn(),
        translate: jest.fn(),
        scale: jest.fn(),
        rotate: jest.fn(),
        arc: jest.fn(),
        fill: jest.fn(),
        measureText: jest.fn().mockReturnValue({ width: 0 }),
        transform: jest.fn(),
        rect: jest.fn(),
        clip: jest.fn(),
        canvas: {},
      };
    }
  }) as unknown as () => RenderingContext | null;
}

// Global mock for keycloak-angular to avoid ESM transform issues with keycloak-js
jest.mock('keycloak-angular', () => ({
  KeycloakService: jest.fn().mockImplementation(() => ({
    getKeycloakInstance: jest.fn().mockReturnValue({ subject: 'mock-user-id' }),
    init: jest.fn().mockResolvedValue(true),
    isLoggedIn: jest.fn().mockResolvedValue(true),
  })),
  KeycloakBearerInterceptor: jest.fn(),
}));
