import { genResources } from './_utils';
import request from '@/utils/request';

export default genResources('customer');

export async function findCustomerList(params: any) {
  return request('customer/findCustomers', {
    method: 'get',
    params,
  });
}
