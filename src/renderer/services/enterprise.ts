import request from '@/utils/request';
import { getCurrentEnterprise as findCurrentEnterprise, saveCurrentEnterprise } from '@/utils/Authorized';

export async function createEnterpriseWithPayment(data: any) {
  return request('/enterprise', {
    method: 'post',
    data,
  })
}

export async function getEnterpriseList(query: any) {
  return request(`/enterprise/`, {
    method: 'get',
    params: query,
  });
}

export async function getEnterpriseByUserID(id: string) {
  return request(`/enterprise/by-user/${id}`, {
    method: 'get',
  });
}

export async function getEnterpriseDetails(id: string) {
  return request(`/enterprise/${id}`, {
    method: 'get',
    params: {
      id,
    },
  });
}

export async function updateEnterprise(id: string, data: any) {
  return request(`/enterprise/${id}`, {
    method: 'put',
    data,
  });
}

export async function removeEnterprise(id: string) {
  return request(`/enterprise/${id}`, {
    method: 'delete',
  });
}

export function setCurrentEnterprise(enterprise: string) {
  saveCurrentEnterprise(enterprise);
}

export function getCurrentEnterprise() {
  return findCurrentEnterprise();
}