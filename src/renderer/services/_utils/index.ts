import request from '@/utils/request';

interface IDict {
  [key: string]: any;
}

export function genResources(url: string) {
  return {
    index: async (query: IDict) => {
      return request(url, {
        method: 'get',
        params: query,
      });
    },
    create: async (body: IDict) => {
      return request(url, {
        method: 'post',
        data: body,
      });
    },
    update: async (id: string, body: IDict) => {
      return request(`${url}/${id}`, {
        method: 'put',
        data: body,
      });
    },
    show: async (id: string) => {
      return request(`${url}/${id}`, {
        method: 'get',
      });
    },
    remove: async (id: string) => {
      return request(`${url}/${id}`, {
        method: 'delete',
      });
    },
  };
}
