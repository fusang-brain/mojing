import { AxiosResponse } from 'axios';
import customer from '@/services/customer';
import { ModelType, IQueryState, ConnectState } from '@/models/connect';
import { listDetailsBuild } from '@/services/_utils/helper';
import { message } from 'antd';

export interface ICustomerState extends IQueryState {
  currentCustomer?: any;
}

export default {
  namespace: 'customers',

  state: {
    queries: {},
    listDetails: {
      list: [],
      pagination: {},
    },
    currentCustomer: {},
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
      const resp: AxiosResponse = yield call(customer.index, payload);
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

    *deleteCustomer({ payload }, { call, put, select }) {
      const resp: AxiosResponse = yield call(customer.remove, payload);
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

    *addCustomer({ payload }, { call, put, select }) {
      const resp: AxiosResponse = yield call(customer.create, payload);
      const { queries } = yield select((_: ConnectState) => _.customers);
      const { status, data } = resp;

      if (status === 201) {
        message.success('零售客户添加成功');

        yield put({
          type: 'loadList',
          payload: queries,
        });
        const { customer: customerObj } = data;
        return customerObj;
      }

      return {};
    },

    *findCustomerProfile({ payload }, { call, put }) {
      const { id } = payload;
      const resp: AxiosResponse = yield call(customer.show, id);
      const { data = {} } = resp;
      const { details } = data;
      // const { lastOptometryInfo , ...customerInfo } = details;
      yield put({
        type: 'saveCurrentCustomer',
        payload: details,
      });
    },

    *updateCustomer({ payload }, { call, put, select }) {
      const { id, ...body } = payload;
      const resp: AxiosResponse = yield call(customer.update, id, body);
      const { queries } = yield select((_: ConnectState) => _.customers);
      const { status } = resp;
      if (status === 201) {
        message.success('零售客户信息修改成功');

        yield put({
          type: 'loadList',
          payload: queries,
        });
      }
    },
  },
} as ModelType<ICustomerState>;
