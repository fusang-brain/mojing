import employee, { loadAllRoles } from '@/services/employee';
import { AxiosResponse } from 'axios';
import { ModelType, IQueryState, ConnectState } from '@/models/connect';
import { listDetailsBuild } from '@/services/_utils/helper';
import { NetworkError } from '@/components/Exception/utils';
import { message } from 'antd';

export interface IEmployee extends IQueryState {
  roles?: Array<any>;
}

export default {
  namespace: 'employee',

  state: {
    listDetails: {
      list: [],
      pagination: {},
      loading: false,
    },
    roles: [],
    queries: {},
  },

  effects: {
    *loadRoles({ payload }, { put, select, call }) {
      const resp: AxiosResponse = yield call(loadAllRoles);

      const { data } = resp;

      if (data) {
        const listDetails = listDetailsBuild(data);
        yield put({
          type: 'saveRoles',
          payload: listDetails.list,
        });

        return listDetails.list;
      }

      return null;
    },

    *createEmployee({ payload }, { put, select, call }) {
      const resp: AxiosResponse = yield call(employee.create, payload);

      const { status } = resp;

      if (status === 201) {
        message.success('员工新增成功，请提醒对方尽快登录并激活');
        yield put({
          type: 'loadList',
          payload: {
            page: 1,
          },
        });
      }
    },

    *loadList({ payload = {} }, { put, call, select }) {
      payload.enterprise = yield select((s: ConnectState) => s.user.currentEnterprise);
      const lastQuires = yield select((s: ConnectState) => s.employee.quires);
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

        const resp = yield call(employee.index, currentQuires);

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

    *removeEmployee({ payload }, { put, select, call }) {
      const resp: AxiosResponse = yield call(employee.remove, payload);

      const { status } = resp;

      if (status === 200) {
        message.success('员工已经从企业移出');

        yield put({
          type: 'loadList',
          payload: {
            page: 1,
          },
        });
      } else if (status === 400) {
        message.error('移除过程出现错误，请稍后再试');
      }
    },

    *updateEmployee({ payload }, { put, select, call }) {
      const { id, ...restBody } = payload;
      const resp: AxiosResponse = yield call(employee.update, id, restBody);

      const { status } = resp;

      if (status === 200) {
        message.success('员工资料修改成功');

        yield put({
          type: 'loadList',
        });
      }
    },
  },

  reducers: {
    saveRoles(state, { payload }) {
      return {
        ...state,
        roles: payload,
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

    saveListDetailsLoading(state: IEmployee, { payload }) {
      return {
        ...state,
        listDetails: {
          ...state.listDetails,
          loading: payload,
        },
      };
    },
  },
} as ModelType<IEmployee>;
