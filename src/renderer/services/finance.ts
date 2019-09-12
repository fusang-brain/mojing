import request from '@/utils/request';
import { defaultPageProps } from './dto';

export function createFinance(body: any) {
  return request('finance', {
    method: 'post',
    data: body,
  });
}

export function removeFinance(id: string) {
  return request(`finance/${id}`, {
    method: 'delete',
  });
}

export function findFinances(params: any) {
  return request('finance', {
    params: {
      ...defaultPageProps,
      ...params,
    },
  });
}

export function findFinanceStatistic(params: any) {
  return request('finance/statistic', {
    params,
  });
}
