import { AxiosResponse } from 'axios';
import sale, { delSale } from '@/services/sale';
import { ModelType, IQueryState, ConnectState } from '@/models/connect';
import { listDetailsBuild } from '@/services/_utils/helper';
import { NetworkError } from '@/components/Exception/utils';
import { message } from 'antd';

export interface ISaleState extends IQueryState {}

export default {
  namespace: 'sale',

  state: {
    listDetails: {
      list: [],
      pagination: {},
      loading: false,
    },

    queries: {},
  },

  reducers: {
    saveQueries(state, { payload }) {
      return {
        ...state,
        queries: payload,
      };
    },

    saveListDetailsLoading(state: ISaleState, { payload }) {
      return {
        ...state,
        listDetails: {
          ...state.listDetails,
          loading: payload,
        },
      };
    },

    saveListDetails(state, { payload }) {
      return {
        ...state,
        listDetails: payload,
      };
    },
  },

  effects: {
    *loadList({ payload = {} }, { put, call, select }) {
      payload.enterprise = yield select((s: ConnectState) => s.user.currentEnterprise);
      const lastQuires = yield select((s: ConnectState) => s.sale.quires);
      yield put({
        type: 'saveListDetailsLoading',
        payload: true,
      });
      const currentQuires = {
        ...lastQuires,
        ...payload,
      };
      try {
        // 保存当前的查询条件
        yield put({
          type: 'saveQueries',
          payload: currentQuires,
        });

        const resp = yield call(sale.index, currentQuires);

        const { data } = resp;
        if (data) {
          yield put({
            type: 'saveListDetails',
            payload: listDetailsBuild(data),
          });
        }
      } catch (e) {
        NetworkError();
      } finally {
        yield put({
          type: 'saveListDetailsLoading',
          payload: false,
        });
      }
    },

    *delSale({ payload }, { put, call, select }) {
      // console.log(payload, 'delSale');
      try {
        const resp: AxiosResponse = yield call(delSale, payload);
        const { status } = resp;
        if (status === 200) {
          message.success('废单成功, 库存已自动恢复');
          yield put({
            type: 'loadList',
            payload: {
              page: 1,
              // pageSize:
            },
          });
        } else {
          message.error('废单失败, 请稍后再试');
        }
      } catch (error) {
        NetworkError();
      }
    },

    *createSale({ payload }, { put, call, select }) {
      // console.log(payload, 'createSale ....');
      try {
        const resp: AxiosResponse = yield call(sale.create, payload);

        const { status, data } = resp;

        if (status === 201) {
          message.success('收账成功');
        }

        if (status === 400) {
          const { error } = data;
          if (error === 'no enough stock') {
            message.error('没有足够的库存, 无法销售成功, 请检查您的库存');
          }
        }

        // console.log(status, 'status');
      } catch (e) {
        NetworkError();
      }
    },
  },
} as ModelType<ISaleState>;
