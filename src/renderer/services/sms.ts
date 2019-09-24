import request from '@/utils/request';

export async function sendValiateCode(phoneNumber: string, kind?: string) {
  return request(`sms/validateCode/${phoneNumber}/k/${kind || 'default'}`, {
    method: 'put',
  });
}
