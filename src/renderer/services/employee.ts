import { genResources } from './_utils';
import request from '@/utils/request';

export default genResources('employee');

export const loadAllRoles = async () => {
  return request('/accessGroup/', {
    method: 'get',
  });
};
