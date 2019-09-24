import { findSimpleProductList, findProductInfo } from '@/services/product';
import {
  createInStockOrder,
  updateInStockOrder,
  saveStockOrderItems,
  loadInStockOrderItems,
  checkOneOrderItem,
  checkedAll,
  instock,
  updateStockOrderState,
  addStockOrderItem,
  deleteStockOrderItem,
} from '@/services/stock';

import _ from 'lodash';
import { AxiosResponse } from 'axios';
// import { notify as message } from '@/components/Notifier';
import { ModelType, IState, ConnectState } from '@/models/connect';
import { message } from 'antd';

export interface InStockState extends IState {
  loadingProducts?: boolean;
  simpleProducts?: [];
  currentOrder: { [key: string]: any };
  selectedItem?: { [key: string]: any };
  currentItems?: Array<{ [key: string]: any }>;
}

export default {
  namespace: 'instock',

  state: {
    loadingProducts: false,
    simpleProducts: [],
    currentOrder: {},
    selectedItem: {},
    currentItems: [],
  },

  reducers: {
    saveLoadingProducts(state, { payload }) {
      return {
        ...state,
        loadingProducts: payload,
      };
    },
    saveSimpleProducts(state, { payload }) {
      return {
        ...state,
        simpleProducts: payload,
        loadingProducts: false,
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

    addCurrentItem(state: InStockState, { payload = {} }) {
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
      yield put({
        type: 'saveLoadingProducts',
        payload: true,
      });
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

    *loadInStockOrderItems({ payload = {} }, { put, call }) {
      const resp = yield call(loadInStockOrderItems, payload);

      const { data } = resp;

      yield put({
        type: 'saveCurrentItems',
        payload: data || [],
      });
    },

    *createInStockOrder({ payload = {} }, { put, call, select }) {
      try {
        payload.enterprise = yield select((s: ConnectState) => s.user.currentEnterprise);
        const resp = yield call(createInStockOrder, payload);

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

    *updateInStockOrder({ payload = {} }, { put, call, select }) {
      try {
        payload.enterprise = yield select((s: ConnectState) => s.user.currentEnterprise);
        payload._id = yield select((s: ConnectState) => s.instock.currentOrder._id);
        const resp = yield call(updateInStockOrder, payload);

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
      const orderID = yield select((o: ConnectState) => o.instock.currentOrder._id);
      payload.orderID = orderID;
      const resp: AxiosResponse = yield call(saveStockOrderItems, payload);

      const { status } = resp;

      if (status === 201) {
        message.success('入库项添加成功');
      }
      return true;
    },

    *updateOrderState({ payload = {} }, { call, select }) {
      const orderID = yield select((o: ConnectState) => o.instock.currentOrder._id);
      payload.orderID = orderID;
      const resp: AxiosResponse = yield call(updateStockOrderState, payload);

      const { status } = resp;

      if (status === 201) {
        message.success('入库项保存成功');
      }

      return true;
    },

    *addStockOrderItem({ payload = {} }, { call, select, put }) {
      const orderID = yield select((o: ConnectState) => o.instock.currentOrder._id);
      payload.orderID = orderID;
      const resp: AxiosResponse = yield call(addStockOrderItem, payload);

      const { status } = resp;

      if (status === 201) {
        yield put({
          type: 'instock/loadInStockOrderItems',
          payload: {
            orderID: orderID,
          },
        });
        message.success('入库项添加成功');
      }
    },

    *deleteStockOrderItem({ payload = {} }, { call, select, put }) {
      const orderID = yield select((o: ConnectState) => o.instock.currentOrder._id);
      payload.orderID = orderID;
      const resp: AxiosResponse = yield call(deleteStockOrderItem, payload);

      const { status } = resp;

      if (status === 200) {
        yield put({
          type: 'instock/loadInStockOrderItems',
          payload: {
            orderID: orderID,
          },
        });
        message.success('入库项删除成功');
      }
    },

    *checkOneOrderItem({ payload = {} }, { select, call, put }) {
      try {
        const orderID = yield select((o: ConnectState) => o.instock.currentOrder._id);
        const resp = yield call(checkOneOrderItem, payload);
        const { data } = resp;

        if (data) {
          message.success('验收成功');
        }
        yield put({
          type: 'loadInStockOrderItems',
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

    *instock({ payload = {} }, { select, call }) {
      const resp: AxiosResponse = yield call(instock, payload.orderID);

      const { data, status } = resp;

      if (data && status === 201) {
        return true;
      }

      return false;
    },

    *checkedAll({ payload = {} }, { select, call, put }) {
      const orderID = yield select((o: ConnectState) => o.instock.currentOrder._id);
      try {
        const resp = yield call(checkedAll, orderID);

        const { data } = resp;

        if (data) {
          message.success('验收成功');
        }
        yield put({
          type: 'loadInStockOrderItems',
          payload: {
            orderID,
          },
        });
      } catch (e) {
        message.error('提交验收信息时出现错误， 请稍后再试!');
      }
    },
  },
} as ModelType<InStockState>;
