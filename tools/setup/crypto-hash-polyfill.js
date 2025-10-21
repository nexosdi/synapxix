const crypto = require('crypto');

function toBuffer(data) {
  if (typeof data === 'string') {
    return Buffer.from(data, 'utf8');
  }
  if (Buffer.isBuffer(data)) {
    return data;
  }
  if (ArrayBuffer.isView(data)) {
    return Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  }
  if (data instanceof ArrayBuffer) {
    return Buffer.from(data);
  }
  throw new TypeError(
    'Unsupported data type passed to crypto.hash polyfill. Expected string, Buffer, TypedArray, DataView, or ArrayBuffer.'
  );
}

if (typeof crypto.hash !== 'function') {
  /**
   * Polyfill for Node 20+ crypto.hash API used by Nx.
   * Mirrors the Node implementation for the subset required by the workspace.
   */
  // eslint-disable-next-line no-param-reassign
  crypto.hash = function hash(algorithm, data, outputEncoding) {
    if (typeof algorithm !== 'string' || algorithm.length === 0) {
      throw new TypeError(
        'Algorithm must be a non-empty string when calling crypto.hash.'
      );
    }
    const hashInstance = crypto.createHash(algorithm);
    hashInstance.update(toBuffer(data));
    const digest = hashInstance.digest();
    if (outputEncoding === undefined || outputEncoding === 'buffer') {
      return digest;
    }
    if (typeof outputEncoding !== 'string') {
      throw new TypeError(
        'Output encoding must be a string when calling crypto.hash.'
      );
    }
    return digest.toString(outputEncoding);
  };
}

if (
  typeof globalThis.crypto === 'object' &&
  globalThis.crypto !== null &&
  typeof globalThis.crypto.hash !== 'function'
) {
  // eslint-disable-next-line no-param-reassign
  globalThis.crypto.hash = crypto.hash;
}
