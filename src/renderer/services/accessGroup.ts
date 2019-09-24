import { genResources } from './_utils';
import request from '@/utils/request';

export default genResources('accessGroup');

export async function getAllAccesses() {
  return request('/access', {
    method: 'get',
  });
}

export async function findGroupAccess(id: string) {
  return request(`/accessGroup/accesses/${id}`, {
    method: 'get',
  });
}

export async function saveAccessToCurrentGroup(groupID: string, accesses: Array<string>) {
  return request(`/accessGroup/add-access/${groupID}`, {
    method: 'put',
    data: {
      accesses,
    },
  });
}
