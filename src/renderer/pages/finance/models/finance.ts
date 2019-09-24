import {
  createFinance,
  findFinances,
  findFinanceStatistic,
  removeFinance,
} from '@/services/finance';

import moment from 'moment';
import { AxiosResponse } from 'axios';
import { IQueryState, ModelType, ConnectState } from '@/models/connect';
import { listDetailsBuild } from '@/services/_utils/helper';
import { message } from 'antd';
import { isStateSuccess } from '@/utils/request';

export interface IFinanceItem {}

export interface IFinanceState extends IQueryState {
  lastSavedFinance: IFinanceItem;
  statistic?: {
    incomeTotal?: number;
    outTotal?: number;
  };
}

export default {
  namespace: 'finance',

  state: {
    lastSavedFinance: {},
    listDetails: {
      list: [],
      pagination: {},
    },
    queries: {},
    statistic: {},
  },

  effects: {
    *loadList({ payload }, { call, put, select }) {
      payload.enterprise = yield select((s: ConnectState) => s.user.currentEnterprise);

      // 保存当前的查询条件
      yield put({
        type: 'saveQueries',
        payload: payload,
      });
      // console.log('start load ....');
      const resp = yield call(findFinances, payload);
      const { data } = resp;

      if (data) {
        yield put({
          type: 'saveListDetails',
          payload: listDetailsBuild(data),
        });
      }
    },

    *create({ payload }, { call, put, select }) {
      const resp = yield call(createFinance, payload);
      const queries = yield select((_: ConnectState) => _.finance.queries);

      const { data } = resp;

      if (data && isStateSuccess(resp)) {
        message.success('记账成功');
        yield put({
          type: 'loadList',
          payload: {
            date: queries.date,
          },
        });
        yield put({
          type: 'saveLastSavedFinance',
          payload: data,
        });
        yield put({
          type: 'loadStatistic',
          payload: {
            date: queries.date || moment().toISOString(),
          },
        });

        return true;
      }

      return false;
    },

    *deleteOne({ payload }, { call, put, select }) {
      const resp: AxiosResponse = yield call(removeFinance, payload);
      const queries = yield select((_: ConnectState) => _.finance.queries);
      const { status } = resp;
      if (status === 200) {
        message.success('记录删除成功');
        yield put({
          type: 'loadList',
          payload: {
            date: queries.date,
          },
        });

        yield put({
          type: 'loadStatistic',
          payload: {
            date: queries.date || moment().toISOString(),
          },
        });

        return true;
      }

      return false;
    },

    *loadStatistic({ payload }, { call, put, select }) {
      payload.enterprise = yield select((s: ConnectState) => s.user.currentEnterprise);

      const resp = yield call(findFinanceStatistic, payload);

      const { data } = resp;
      if (data) {
        yield put({
          type: 'saveStatistic',
          payload: data[0],
        });
      }
    },
  },

  reducers: {
    saveStatistic(state, { payload }) {
      const defaultStatistic = {
        incomeTotal: 0,
        outTotal: 0,
      };

      return {
        ...state,
        statistic: payload ? payload : defaultStatistic,
      };
    },

    saveQueries(state, { payload }) {
      return {
        ...state,
        queries: payload,
      };
    },

    saveListDetails(state, { payload }) {
      return {
        ...state,
        listDetails: payload,
      };
    },

    saveLastSavedFinance(state, { payload }) {
      return {
        ...state,
        lastSavedFinance: payload,
      };
    },
  },
} as ModelType<IFinanceState>;
