// import hash from 'hash.js';

const DefaultFingerprintPrefix = 'TABLE_FINGERPRINT';

export const getRowID = (row: any) => {
  if (!row) {
    return genFingerprint(`${Date.now()}_NULL`);
  }

  return row.id || `${Math.random()}_${Date.now()}`;
};

export function genFingerprint(obj: any) {
  // let optstr = '--';
  if (typeof obj === 'string') {
    obj = {
      object: obj,
    };
  }
  const optstr = JSON.stringify(obj);

  const _fingerprint = `${DefaultFingerprintPrefix}_${optstr}`;

  // return hash
  // const hashcode = hash.sha256().update(_fingerprint).digest('hex');

  return _fingerprint;
}
