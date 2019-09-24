import { findStockOrderList } from '@/services/stock';
import { message } from 'antd';
import { ModelType, IQueryState, ConnectState } from '@/models/connect';
import { listDetailsBuild } from '@/services/_utils/helper';

export interface IStock extends IQueryState {}

export default {
  namespace: 'stock',

  state: {
    queries: {},
    listDetails: {
      list: [],
      pagination: {
        page: 0,
        pageSize: 15,
        total: 0,
      },
    },
    productStockList: {
      list: [],
      pagination: {
        page: 0,
        pageSize: 15,
        total: 0,
      },
    },
  },

  effects: {
    *loadList({ payload = {} }, { put, call, select }) {
      try {
        payload.enterprise = yield select((s: ConnectState) => s.user.currentEnterprise);
        const resp = yield call(findStockOrderList, payload);
        const { data } = resp;
        if (data) {
          yield put({
            type: 'saveListDetails',
            payload: listDetailsBuild(data),
          });
        }
      } catch (e) {
        message.error(e.message);
      }
    },
  },

  reducers: {
    saveListDetails(state, { payload }) {
      return {
        ...state,
        listDetails: payload,
      };
    },

    saveQueries(state, { payload }) {
      return {
        ...state,
        queries: payload,
      };
    },
  },
} as ModelType<IStock>;
