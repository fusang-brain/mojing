// import hash from 'hash.js';
// import { genHashcode } from './helper';
// // import { reloadAuthorized } from './Authorized';


// const AUTH_KEY = genHashcode('mojing-authority');
// const AUTH_HASH = genHashcode('mojing-auth-hashcode');


// export interface Authorization {
//   authority:string|string[];
//   token:string;
//   uid?:string;
// }

// const defaultAuthorization: Authorization = {
//   authority: 'guest',
//   token: 'notoken',
// }

// let CurrentAuthorization = defaultAuthorization;

// export function getAuthorization() {
//   const foundAuthorization = localStorage.getItem(AUTH_KEY);
//   const parsedAuthorization: Authorization = foundAuthorization ? JSON.parse(foundAuthorization) : defaultAuthorization;
//   return parsedAuthorization || defaultAuthorization;
// }

// export function getAccessToken() {
//   return CurrentAuthorization.token;
// }

// export function hashAuth(body: string):string {
//   return hash.sha256().update(body).digest('hex');
// }

// export function getAuthHashFromSession(): string {
//   return sessionStorage.getItem(AUTH_HASH) || hashAuth(JSON.stringify(defaultAuthorization));
// }

// export function getAuthHash(): string {
//   return hashAuth(localStorage.getItem(AUTH_KEY) || '');
// }

// export function setAuthorization(auth: Authorization) {
//   const authStr = JSON.stringify(auth);
//   sessionStorage.setItem(AUTH_HASH, hashAuth(authStr));
//   localStorage.setItem(AUTH_KEY, authStr);
// }

// export function setAccessToken(token: string) {
//   CurrentAuthorization.token = token;
//   localStorage.setItem(AUTH_KEY, JSON.stringify(CurrentAuthorization));
//   reloadAuthorization();
// }

// // use localStorage to store the authority info, which might be sent from server in actual project.
// export function getAuthority(str?: string): (string | string[]) {
//   const currentAuthority = CurrentAuthorization.authority;
//   const authorityString =
//     typeof str === 'undefined' ? currentAuthority : str;
//   let authority: (string | string[]) = 'guest';
//   try {
//     if (authorityString) {
//       authority = authorityString;
//     }
//   } catch (e) {
//     authority = authorityString;
//   }
//   if (typeof authority === 'string') {
//     return [authority];
//   }
  
//   return authority;
// }

// export function setAuthority(authority: string | string[]): void {
//   CurrentAuthorization.authority = authority;
//   localStorage.setItem(AUTH_KEY, JSON.stringify(CurrentAuthorization));
//   reloadAuthorization();
// }

// export const reloadAuthorization = () => {
//   CurrentAuthorization = getAuthorization();
//   reloadAuthorized();
// }
