

import hash from 'hash.js';


export type FingerprintOption = {
  hostname?:string;
  uid?:string;
} & {[key: string]: string };

export function setFingerprint(fgp: string) {
  Fingerprint.fingerprint = fgp;
}

export default class Fingerprint {
  static fingerprint: string;

  static init(option: FingerprintOption): string {
    const { hostname, uid, ...restOpts } = option;
  
    const restOptstr = JSON.stringify(restOpts);
  
    const _fingerprint = `${option.hostname}&${option.uid}&${restOptstr}`;
  
    // return hash
    const hashcode = hash.sha256().update(_fingerprint).digest('hex');
  
    setFingerprint(hashcode);

    return Fingerprint.fingerprint;
  }

  static reset(option: FingerprintOption) {
    Fingerprint.init(option);
  }
}