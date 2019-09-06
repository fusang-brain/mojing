import Fingerprint from './Fingerprint';


function genKeyName(name: string) {
  return `${Fingerprint.fingerprint}:${name}`;
}

export default class Storage {
  static setItem(key: string, value: string) {
    return localStorage.setItem(genKeyName(key), value);
  }

  static getItem(key: string): string {
    return localStorage.getItem(genKeyName(key)) || '';
  }

  static removeItem(key: string) {
    localStorage.removeItem(genKeyName(key));
  }

  static clear() {
    localStorage.clear();
  }
}