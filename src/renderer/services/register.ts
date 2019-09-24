import request from '@/utils/request';
import { ServiceRequest } from '.';

export async function sendRegister(req: ServiceRequest) {
  return request('user/register', {
    method: 'post',
    data: req.body,
  });
}
