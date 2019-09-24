import { genResources } from './_utils';
import request from '@/utils/request';

export async function delSale(id: string) {
  return request('sale/del', {
    method: 'delete',
    data: {
      id,
    },
  });
}

export default genResources('sale');
