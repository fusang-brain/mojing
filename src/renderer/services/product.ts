import request from '@/utils/request';

export async function updateProduct(id: string, data: any) {
  return request(`product/${id}`, {
    method: 'put',
    data,
  });
}

export async function createProduct(data: any) {
  return request('product', {
    method: 'post',
    data,
  });
}

export async function removeProduct(id: string) {
  return request(`product/${id}`, {
    method: 'delete',
  });
}

export async function removeProductBatch(id: string) {
  return request(`product/batch/${id}`, {
    method: 'delete',
  });
}

export async function findProductList(params: any) {
  return request('product', {
    method: 'get',
    params,
  });
}

export async function findProductBatchList(params: any) {
  return request('product/batches', {
    method: 'get',
    params,
  });
}

export async function findSimpleProductList(params: any) {
  return request('product/simpleList', {
    method: 'get',
    params,
  });
}

export async function findProductInfo(id: string) {
  return request(`product/${id}`, {
    method: 'get',
  });
}

export async function findBatchesByProduct(params: any) {
  return request('product/batches', {
    method: 'get',
    params: params,
  });
}

export async function findProductStockList(query: any) {
  return request('product/stockList', {
    method: 'get',
    params: query,
  });
}

export async function createProductBatch(body: any) {
  // console.log(body, 'body');
  return request('product/createBatch', {
    method: 'post',
    data: body,
  });
}
