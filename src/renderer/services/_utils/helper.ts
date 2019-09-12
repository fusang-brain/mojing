import { IListDetails } from '../../models/connect';

export function listDetailsBuild(body: any): IListDetails {
  const { list, page, pageSize, total } = body;

  return {
    list: list || [],
    pagination: {
      page,
      pageSize,
      total,
    },
  };
}
