import { findBatchesByProduct } from '@/services/product';
import { message } from 'antd';
import { ModelType } from './connect';

export interface SelectProductBatchModelState {
  options?: any[];
}

export default {
  namespace: 'selectProductBatch',

  state: {
    options: [],
  },

  reducers: {
    saveOptions(state, { payload = [] }) {
      return {
        ...state,
        options: payload,
      };
    },
  },

  effects: {
    *loadOptions({ payload }, { call, put }) {
      const { id, search } = payload;

      try {
        const resp = yield call(findBatchesByProduct, { id, search });

        const { data } = resp;

        yield put({
          type: 'saveOptions',
          payload: data.list || [],
        });
      } catch (e) {
        message.error(e.message);
      }
    },
  },
} as ModelType<SelectProductBatchModelState>;
