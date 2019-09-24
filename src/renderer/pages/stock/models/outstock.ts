import { findSimpleProductList, findProductInfo } from '@/services/product';
import {
  loadOutStockOrderItems,
  createOutStockOrder,
  updateOutStockOrder,
  saveOutStockOrderItems,
  checkOneOutStockOrderItem,
  outStock,
  checkedAllOutStockItems,
  updateOutStockOrderState,
  addOutStockOrderItem,
  deleteOutStockOrderItem,
} from '@/services/stock';
import { message } from 'antd';
import _ from 'lodash';
import { AxiosResponse } from 'axios';
import { ModelType, IState, ConnectState } from '@/models/connect';

export interface OutStockState extends IState {
  simpleProducts?: [];
  currentOrder: { [key: string]: any };
  selectedItem?: { [key: string]: any };
  currentItems?: Array<{ [key: string]: any }>;
}

export default {
  namespace: 'outstock',

  state: {
    simpleProducts: [],
    currentOrder: {},
    selectedItem: {},
    currentItems: [],
  },

  reducers: {
    saveSimpleProducts(state, { payload }) {
      return {
        ...state,
        simpleProducts: payload,
      };
    },
    saveCurrentOrder(state, { payload }) {
      return {
        ...state,
        currentOrder: payload,
      };
    },
    saveSelectedItem(state, { payload }) {
      return {
        ...state,
        selectedItem: payload,
      };
    },
    saveCurrentItems(state, { payload = [] }) {
      return {
        ...state,
        currentItems: payload,
      };
    },

    addCurrentItem(state: OutStockState, { payload = {} }) {
      const { currentItems = [] } = state;
      const { total, ...restPayload } = payload;

      const foundIndex = _.findIndex(currentItems, restPayload);

      if (foundIndex >= 0) {
        currentItems[foundIndex].total = currentItems[foundIndex].total + total;
      } else {
        currentItems.push(payload);
      }

      return {
        ...state,
        currentItems: currentItems,
      };
    },

    clearCurrentOrderInfo(state, action) {
      return {
        ...state,
        currentOrder: {},
        selectedItem: {},
        currentItems: [],
      };
    },
  },

  effects: {
    *loadSimpleProducts({ payload = {} }, { put, call, select }) {
      payload.enterprise = yield select((s: ConnectState) => s.user.currentEnterprise);
      const resp = yield call(findSimpleProductList, payload);

      const { data = {} } = resp;
      const { list = [] } = data;
      yield put({
        type: 'saveSimpleProducts',
        payload: list,
      });
    },

    *loadProductInfo({ payload = {} }, { put, call, select }) {
      const { id } = payload;
      try {
        const resp = yield call(findProductInfo, id);

        const { data } = resp;
        console.log(data, 'response data');
        yield put({
          type: 'saveSelectedItem',
          payload: data.info,
        });
        return true;
      } catch (e) {
        message.error(e.message);
        return false;
      }
    },

    *loadOutStockOrderItems({ payload = {} }, { put, call }) {
      const resp = yield call(loadOutStockOrderItems, payload);

      const { data } = resp;

      yield put({
        type: 'saveCurrentItems',
        payload: data || [],
      });
    },

    *createOutStockOrder({ payload = {} }, { put, call, select }) {
      try {
        payload.enterprise = yield select((s: ConnectState) => s.user.currentEnterprise);
        const resp = yield call(createOutStockOrder, payload);

        const { status, data } = resp;
        if (+status === 201) {
          yield put({
            type: 'saveCurrentOrder',
            payload: data.order,
          });
        }
      } catch (e) {
        message.error(e.message);
      }
    },

    *updateOutStockOrder({ payload = {} }, { put, call, select }) {
      try {
        payload.enterprise = yield select((s: ConnectState) => s.user.currentEnterprise);
        payload._id = yield select((s: ConnectState) => s.outstock.currentOrder._id);
        const resp = yield call(updateOutStockOrder, payload);

        const { status, data } = resp;
        if (+status === 201) {
          yield put({
            type: 'saveCurrentOrder',
            payload: data.order,
          });
        }
      } catch (e) {
        message.error(e.message);
      }
    },

    *uploadOrderItems({ payload = {} }, { call, select }) {
      const orderID = yield select((o: ConnectState) => o.outstock.currentOrder._id);
      payload.orderID = orderID;
      const resp: AxiosResponse = yield call(saveOutStockOrderItems, payload);

      const { status } = resp;

      if (status === 201) {
        message.success('入库项添加成功');
      }
    },

    *updateOrderState({ payload = {} }, { call, select }) {
      const orderID = yield select((o: ConnectState) => o.outstock.currentOrder._id);
      payload.orderID = orderID;
      const resp: AxiosResponse = yield call(updateOutStockOrderState, payload);

      const { status } = resp;

      if (status === 201) {
        message.success('入库项保存成功');
      }

      return true;
    },

    *addStockOrderItem({ payload = {} }, { call, select, put }) {
      const orderID = yield select((o: ConnectState) => o.outstock.currentOrder._id);
      payload.orderID = orderID;
      const resp: AxiosResponse = yield call(addOutStockOrderItem, payload);

      const { status } = resp;

      if (status === 201) {
        yield put({
          type: 'outstock/loadOutStockOrderItems',
          payload: {
            orderID: orderID,
          },
        });
        message.success('入库项添加成功');
      }
    },

    *deleteStockOrderItem({ payload = {} }, { call, select, put }) {
      const orderID = yield select((o: ConnectState) => o.outstock.currentOrder._id);
      payload.orderID = orderID;
      const resp: AxiosResponse = yield call(deleteOutStockOrderItem, payload);

      const { status } = resp;

      if (status === 200) {
        yield put({
          type: 'outstock/loadOutStockOrderItems',
          payload: {
            orderID: orderID,
          },
        });
        message.success('入库项删除成功');
      }
    },

    *checkOneOrderItem({ payload = {} }, { select, call, put }) {
      try {
        const orderID = yield select((o: ConnectState) => o.outstock.currentOrder._id);
        const resp = yield call(checkOneOutStockOrderItem, payload);
        const { data } = resp;

        if (data) {
          message.success('验收成功');
        }
        yield put({
          type: 'loadOutStockOrderItems',
          payload: {
            orderID,
          },
        });
        return true;
      } catch (e) {
        message.error('提交验收信息时出现错误，请稍后再试!');
        return false;
      }
    },

    *outstock({ payload = {} }, { select, call }) {
      const resp: AxiosResponse = yield call(outStock, payload.orderID);

      const { data, status } = resp;

      if (data && status === 201) {
        return true;
      }

      return false;
    },

    *checkedAll({ payload = {} }, { select, call, put }) {
      const orderID = yield select((o: ConnectState) => o.outstock.currentOrder._id);
      try {
        const resp = yield call(checkedAllOutStockItems, orderID);

        const { data } = resp;

        if (data) {
          message.success('验收成功');
        }
        yield put({
          type: 'loadOutStockOrderItems',
          payload: {
            orderID,
          },
        });
      } catch (e) {
        message.error('提交验收信息时出现错误， 请稍后再试!');
      }
    },
  },
} as ModelType<OutStockState>;
