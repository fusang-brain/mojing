import {
  getEnterpriseByUserID,
  getEnterpriseDetails,
  updateEnterprise,
  createEnterpriseWithPayment,
  setCurrentEnterprise,
} from '@/services/enterprise';
import { AxiosResponse } from 'axios';
import { ModelType, IState } from './connect';
import router from 'umi/router';
import { message } from 'antd';
import { NetworkError } from '@/components/Exception/utils';

export interface IEnterprise extends IState {
  list?: Array<any>;
  currentEnterprise?: string;
  currentEnterpriseInfo?: { [key: string]: any };
}

export default {
  namespace: 'enterprise',

  state: {
    list: [],
    currentEnterprise: '',
    currentEnterpriseInfo: {},
  },

  effects: {
    *createWithPayment({ payload }, { call, put }) {
      try {
        const resp: AxiosResponse = yield call(createEnterpriseWithPayment, payload);
        const { data, status } = resp;

        if (status === 201) {
          const { payment } = data;

          if (payment.state === 'paid') {
            // 已经付款成功，那么开通成功, 进入首页
            message.success('商铺开通成功');
          }

          // 企业创建成功, 但是未成功开通, 进入首页
          message.warning('企业已经创建成功, 商业服务在您付款成功后将会自动开通');
          router.push('/');
        }
      } catch (e) {
        NetworkError();
      }
    },

    *updateEnterpriseByID({ payload }, { call, put }) {
      const { id, ...rest } = payload;

      try {
        const resp: AxiosResponse = yield call(updateEnterprise, id, rest);

        const { data } = resp;
        const { enterprise } = data;

        yield put({
          type: 'saveCurrentEnterprise',
          payload: enterprise,
        });

        message.success('店铺信息修改成功');
      } catch (e) {
        NetworkError();
      }

      return true;
    },

    *loadEnterpriseByUserID({ payload }, { call, put }) {
      try {
        const { id } = payload;
        const resp: AxiosResponse = yield call(getEnterpriseByUserID, id);
        const { data } = resp;
        const { list = [] } = data;

        yield put({
          type: 'saveEnterpriseList',
          payload: list,
        });

        return list;
      } catch (e) {
        NetworkError();
      }
    },

    *loadEnterpriseDetailsById({ payload }, { call, put }) {
      const { id = '' } = payload;
      if (!id || id === 'undefined') {
        return;
      }
      const resp: AxiosResponse = yield call(getEnterpriseDetails, id);

      const { data } = resp;
      const { details } = data;

      yield put({
        type: 'saveCurrentEnterprise',
        payload: details,
      });
    },

    // *doSaveCurrentEnterprise
  },

  reducers: {
    saveCurrentEnterprise(state, { payload }) {
      setCurrentEnterprise(payload._id);

      return {
        ...state,
        currentEnterpriseInfo: payload,
        currentEnterprise: payload._id,
      };
    },

    saveEnterpriseList(state, { payload }) {
      return {
        ...state,
        list: payload,
      };
    },
  },
} as ModelType<IEnterprise>;
