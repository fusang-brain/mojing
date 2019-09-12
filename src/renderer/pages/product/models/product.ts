import { ModelType, IListDetails, IQueryState, ConnectState } from '@/models/connect';
import {
  createProduct,
  findProductList,
  removeProduct,
  findProductBatchList,
  createProductBatch,
  findProductInfo,
  updateProduct,
  removeProductBatch,
} from '@/services/product';

// import { notify } from '@/components/Notifier';
import { AxiosResponse } from 'axios';
import { listDetailsBuild } from '@/services/_utils/helper';
import { message } from 'antd';
import { NetworkError } from '@/components/Exception/utils';

export interface IProductState extends IQueryState {
  lastCreatedProduct?: { [key: string]: any };
  batchListDetails: IListDetails;
  batchQueries: { [key: string]: any };
}

export default {
  namespace: 'product',

  state: {
    lastCreatedProduct: {},
    listDetails: {
      list: [],
      pagination: {},
      loading: false,
    },
    queries: {},
    batchListDetails: {
      list: [],
      pagination: {},
      loading: false,
    },
    batchQueries: {},
  },

  reducers: {
    saveLastCreatedProduct(state, { payload }) {
      return {
        ...state,
        lastCreatedProduct: payload,
      };
    },

    saveListDetails(state, { payload }) {
      return {
        ...state,
        listDetails: payload,
      };
    },

    saveBatchListDetails(state, { payload }) {
      return {
        ...state,
        batchListDetails: payload,
      };
    },

    saveListDetailsLoading(state: IProductState, { payload }) {
      return {
        ...state,
        listDetails: {
          ...state.listDetails,
          loading: payload,
        },
      };
    },

    saveBatchQueries(state, { payload }) {
      return {
        ...state,
        batchQueries: payload,
      };
    },

    saveQueries(state, { payload }) {
      return {
        ...state,
        queries: payload,
      };
    },
  },

  effects: {
    *updateProduct({ payload }, { put, call }) {
      const { id, ...restBody } = payload;
      try {
        const resp: AxiosResponse = yield call(updateProduct, id, restBody);

        const { status } = resp;

        if (status === 200) {
          message.success('商品信息修改成功');
        }
        yield put({
          type: 'loadList',
        });
        return true;
      } catch (err) {
        NetworkError();
        return false;
      }
    },

    *findProductInfo({ payload }, { put, call }) {
      try {
        const resp: AxiosResponse = yield call(findProductInfo, payload);

        const { data } = resp;

        const { info = {} } = data;

        return info;
      } catch (err) {
        NetworkError();
        return {};
      }
    },

    *loadList({ payload = {} }, { put, call, select }) {
      payload.enterprise = yield select((s: ConnectState) => s.user.currentEnterprise);
      yield put({
        type: 'saveListDetailsLoading',
        payload: true,
      });
      try {
        // 保存当前的查询条件
        yield put({
          type: 'saveQueries',
          payload: payload,
        });

        const resp = yield call(findProductList, payload);

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

    *createProduct({ payload }, { put, call, select }) {
      try {
        payload.enterprise = yield select((s: ConnectState) => s.user.currentEnterprise);
        const resp: AxiosResponse = yield call(createProduct, payload);

        const { status, data } = resp;

        if (status === 201 && data) {
          yield put({
            type: 'saveLastCreatedProduct',
            payload: {
              ...payload,
              ...data,
            },
          });

          message.success('商品添加成功');
          return data._id;
        }
      } catch (e) {
        message.error('商品添加出现错误');
        return false;
      }

      return false;
    },

    *removeProduct({ payload }, { put, call, select }) {
      const { queries } = yield select((item: any) => item.product);
      const resp: AxiosResponse = yield call(removeProduct, payload);

      const { status } = resp;

      if (status === 200) {
        yield put({
          type: 'loadList',
          payload: {
            ...queries,
          },
        });

        message.success('商品信息成功');
        return true;
      } else {
        message.error('商品移除失败');
        return false;
      }
    },

    *loadBatchList({ payload }, { put, call, select }) {
      try {
        // 保存当前的查询条件
        yield put({
          type: 'saveBatchQueries',
          payload: payload,
        });

        const resp = yield call(findProductBatchList, payload);
        const { data } = resp;
        if (data) {
          yield put({
            type: 'saveBatchListDetails',
            payload: listDetailsBuild(data),
          });
        }
        return true;
      } catch (e) {
        NetworkError();
        return false;
      }

      return false;
    },

    *createOneProductBatch({ payload }, { put, call, select }) {
      try {
        const resp: AxiosResponse = yield call(createProductBatch, payload);

        const { status } = resp;

        if (status === 201) {
          // yield put({
          //   type: 'loadBatchList',
          //   payload: {
          //     id: payload.productID,
          //   },
          // });

          message.success('商品添加成功');

          return true;
        }
      } catch (e) {
        NetworkError();
        return false;
      }

      return false;
    },

    *removeOneProductBatch({ payload }, { call }) {
      const resp: AxiosResponse = yield call(removeProductBatch, payload);

      const { status } = resp;

      if (status === 200) {
        message.success('批次删除成功');
        return true;
      } else {
        message.error('批次移除失败');
        return false;
      }
    },
  },
} as ModelType<IProductState>;
