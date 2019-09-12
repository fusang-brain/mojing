import request from '@/utils/request';
import Storage from '@/utils/Storage';

const LOCAL_CURRENT_ENTERPRISE = 'local_current_enterprise';

export async function findOperators(enterprise: string) {
  return request('user/operators', {
    method: 'get',
    params: {
      enterprise,
    },
  });
}

export async function findUserInfo(uid: string = '') {
  return request('user/info', {
    method: 'get',
  });
}

export async function getCurrentEnterprise() {
  return Storage.getItem(LOCAL_CURRENT_ENTERPRISE);
}

export function saveCurrentEnterprise(enterprse: string) {
  return Storage.setItem(LOCAL_CURRENT_ENTERPRISE, enterprse);
}

export function queryNotices() {
  return null;
}
