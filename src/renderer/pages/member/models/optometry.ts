import { AxiosResponse } from 'axios';
import optometry from '@/services/optometry';

import { ModelType, IQueryState, ConnectState } from '@/models/connect';
import { listDetailsBuild } from '@/services/_utils/helper';
import { message } from 'antd';

export interface IOptometryState extends IQueryState {
  currentOptometry?: any;
}

export default {
  namespace: 'optometry',

  state: {
    queries: {},
    listDetails: {
      list: [],
      pagination: {},
    },
    currentOptometry: {},
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

    saveCurrentCustomer(state, { payload }) {
      return {
        ...state,
        currentCustomer: payload,
      };
    },
  },

  effects: {
    *loadList({ payload }, { call, put }) {
      const resp: AxiosResponse = yield call(optometry.index, payload);
      const { data } = resp;
      if (data) {
        yield put({
          type: 'saveListDetails',
          payload: listDetailsBuild(data),
        });

        yield put({
          type: 'saveQueries',
          payload: payload,
        });
      }
    },

    *deleteOptometry({ payload }, { call, put, select }) {
      const resp: AxiosResponse = yield call(optometry.remove, payload);
      const { queries } = yield select((_: ConnectState) => _.customers);
      const { status } = resp;
      if (status === 200) {
        message.success('零售客户删除成功');

        yield put({
          type: 'loadList',
          payload: queries,
        });
      }
    },

    *addOptometry({ payload }, { call, put, select }) {
      const resp: AxiosResponse = yield call(optometry.create, payload);
      const { queries } = yield select((_: ConnectState) => _.optometry);
      const { status, data } = resp;
      if (status === 201) {
        message.success('验光记录添加成功');
        const { optometry } = data;
        yield put({
          type: 'loadList',
          payload: queries,
        });
        return optometry;
      }

      return null;
    },

    *findOptometryProfile({ payload }, { call, put }) {
      const { id } = payload;
      const resp: AxiosResponse = yield call(optometry.show, id);
      const { data = {} } = resp;
      const { details } = data;

      yield put({
        type: 'saveCurrentCustomer',
        payload: details,
      });
    },
  },
} as ModelType<IOptometryState>;
