import provider from '@/services/provider';
import { AxiosResponse } from 'axios';
import { ModelType, IQueryState, ConnectState } from '@/models/connect';
import { listDetailsBuild } from '@/services/_utils/helper';
import { message } from 'antd';

export interface IProvidersState extends IQueryState {
  currentProvider?: any;
}

export default {
  namespace: 'providers',

  state: {
    queries: {},
    listDetails: {
      list: [],
      pagination: {},
    },
    currentProvider: {},
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

    saveCurrentProvider(state, { payload }) {
      return {
        ...state,
        currentProvider: payload,
      };
    },
  },

  effects: {
    *loadList({ payload }, { call, put }) {
      const resp: AxiosResponse = yield call(provider.index, payload);
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

    *findProviderProfile({ payload }, { call, put }) {
      const { id } = payload;
      const resp: AxiosResponse = yield call(provider.show, id);
      const { data = {} } = resp;
      const { details } = data;

      yield put({
        type: 'saveCurrentProvider',
        payload: details,
      });
    },

    *addProvider({ payload }, { call, put, select }) {
      const resp: AxiosResponse = yield call(provider.create, payload);
      const { status } = resp;
      const { queries } = yield select((_: ConnectState) => _.providers);
      if (status === 201) {
        message.success('供应商添加成功');

        yield put({
          type: 'loadList',
          payload: queries,
        });
      }
    },

    *updateProvider({ payload }, { call, put, select }) {
      const { id, ...body } = payload;
      const { queries } = yield select((_: ConnectState) => _.providers);
      const resp: AxiosResponse = yield call(provider.update, id, body);

      const { status } = resp;
      if (status === 201) {
        message.success('供应商信息修改成功');

        yield put({
          type: 'loadList',
          payload: queries,
        });
      }
    },
  },
} as ModelType<IProvidersState>;
