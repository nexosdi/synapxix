import { TextEncoder, TextDecoder } from 'util';
import { ReadableStream } from 'stream/web';

Object.assign(globalThis, { TextEncoder, TextDecoder, ReadableStream });

globalThis.ngJest = {
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
  platformBrowserDynamicTesting(),
);
