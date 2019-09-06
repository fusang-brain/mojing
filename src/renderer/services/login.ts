import request from '@/utils/request';

import { genHashcode } from '@/utils/helper';
import { Authorization, getAuthHash } from '@/utils/Authorized';

const REMEMBER_KEY = genHashcode('RememberME');

export const accountLogin: ServiceFunc = async (req: ServiceRequest) => {
  return request('user/login', {
    method: 'post',
    data: req.body,
  });
}

export function setRememberMe(body: Authorization) {
  localStorage.setItem(REMEMBER_KEY, genHashcode(body));
}

export function isRememberMe(): boolean {
  const rememberMe = localStorage.getItem(REMEMBER_KEY);

  if (rememberMe && getAuthHash() === rememberMe) {
    return true;
  }

  return false;
}

export function clearRememberMe() {
  localStorage.removeItem(REMEMBER_KEY);
}