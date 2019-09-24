// import { IStockQuery } from '@/typing/models';
import { message } from 'antd';

import { findProductStockList } from '@/services/product';
import { ModelType, IQueryState } from '@/models/connect';
import { listDetailsBuild } from '@/services/_utils/helper';

export interface IStockQuery extends IQueryState {}

export default {
  namespace: 'stockQuery',

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
  },

  effects: {
    *loadList({ payload = {} }, { put, call }) {
      try {
        const resp = yield call(findProductStockList, payload);
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
} as ModelType<IStockQuery>;
