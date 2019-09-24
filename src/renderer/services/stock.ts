import request from '@/utils/request';

export async function createInStockOrder(body: any) {
  return request('stock/createOrder', {
    method: 'post',
    data: body,
  });
}

export async function createOutStockOrder(body: any) {
  return request('stock/createOutStockOrder', {
    method: 'post',
    data: body,
  });
}

export async function findStockOrderList(query: any) {
  return request('stock/findOrders', {
    method: 'get',
    params: query,
  });
}

export async function findOutStockOrderList(query: any) {
  return request('stock/findOutStockOrders', {
    method: 'get',
    params: query,
  });
}

export async function updateInStockOrder(body: any) {
  return request('stock/updateOrder', {
    method: 'put',
    data: body,
  });
}

export async function updateOutStockOrder(body: any) {
  return request('stock/updateOutStockOrder', {
    method: 'put',
    data: body,
  });
}

export async function saveStockOrderItems(body: any) {
  return request('stock/setStockItems', {
    method: 'post',
    data: body,
  });
}

export async function updateStockOrderState(body: any) {
  return request('stock/updateStockItemsState', {
    method: 'post',
    data: body,
  });
}

export async function updateOutStockOrderState(body: any) {
  return request('stock/updateOutStockItemsState', {
    method: 'post',
    data: body,
  });
}

export async function addStockOrderItem(body: any) {
  return request('stock/addStockItem', {
    method: 'post',
    data: body,
  });
}

export async function addOutStockOrderItem(body: any) {
  return request('stock/addOutStockItem', {
    method: 'post',
    data: body,
  });
}

export async function deleteStockOrderItem(body: any) {
  return request('stock/deleteStockItem', {
    method: 'delete',
    data: body,
  });
}

export async function deleteOutStockOrderItem(body: any) {
  return request('stock/deleteOutStockItem', {
    method: 'delete',
    data: body,
  });
}

export async function saveOutStockOrderItems(body: any) {
  return request('stock/setOutStockItems', {
    method: 'post',
    data: body,
  });
}

export async function loadInStockOrderItems(params: any) {
  return request('stock/findOrderItems', {
    method: 'get',
    params: params,
  });
}

export async function loadOutStockOrderItems(params: any) {
  return request('stock/findOutStockOrderItems', {
    method: 'get',
    params: params,
  });
}

export async function checkOneOrderItem(body: any) {
  return request('stock/checkOneOrderItem', {
    method: 'put',
    data: body,
  });
}

export async function checkOneOutStockOrderItem(body: any) {
  return request('stock/checkOneOutStockOrderItem', {
    method: 'put',
    data: body,
  });
}

export async function checkedAll(orderID: any) {
  return request('stock/checkedAllOrderItems', {
    method: 'put',
    data: {
      orderID: orderID,
    },
  });
}

export async function checkedAllOutStockItems(orderID: any) {
  return request('stock/checkedAllOutStockOrderItems', {
    method: 'put',
    data: {
      orderID: orderID,
    },
  });
}

export async function instock(orderID: any) {
  return request('stock/instock', {
    method: 'post',
    data: {
      orderID,
    },
  });
}

export async function outStock(orderID: any) {
  return request('stock/outstock', {
    method: 'post',
    data: {
      orderID,
    },
  });
}
