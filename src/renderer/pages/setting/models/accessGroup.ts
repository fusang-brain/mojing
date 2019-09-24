import { AxiosResponse } from 'axios';
import accessGroup, {
  getAllAccesses,
  findGroupAccess,
  saveAccessToCurrentGroup,
} from '@/services/accessGroup';
import { ModelType, IQueryState, ConnectState } from '@/models/connect';
import { message } from 'antd';
import { listDetailsBuild } from '@/services/_utils/helper';
import { NetworkError } from '@/components/Exception/utils';

export interface IAccessGroup extends IQueryState {
  accesses?: Array<any>;
  groupAccesses?: Array<any>;
}

export default {
  namespace: 'accessGroup',

  state: {
    listDetails: {
      list: [],
      pagination: {},
      loading: false,
    },
    accesses: [],
    queries: {},
    groupAccesses: [],
  },

  effects: {
    *saveAccessToCurrentGroup({ payload }, { put, call }) {
      const { accesses, groupID } = payload;

      const resp: AxiosResponse = yield call(saveAccessToCurrentGroup, groupID, accesses);

      const { status } = resp;
      if (status === 200) {
        message.success('权限保存成功!');
      }
    },

    *findGroupAccess({ payload }, { put, call, select }) {
      const { list = [] } = yield select((_: ConnectState) => _.accessGroup.listDetails);
      let groupID = null;
      if (!payload) {
        groupID = list[0] ? list[0]._id : null;
      } else {
        groupID = payload;
      }

      if (!groupID) {
        return;
      }

      const resp: AxiosResponse = yield call(findGroupAccess, groupID);

      const { data } = resp;
      const { accesses } = data;

      yield put({
        type: 'saveGroupAccesses',
        payload: accesses,
      });
    },

    *create({ payload }, { put, select, call }) {
      const resp: AxiosResponse = yield call(accessGroup.create, payload);

      const { status, data } = resp;

      if (status === 201) {
        message.success(`角色组"${payload.name}"创建成功`);
        yield put({
          type: 'addOne',
          payload: data.group,
        });

        return true;
      }

      return false;
    },

    *loadAllAccess({ payload = {} }, { put, call, select }) {
      // payload.enterprise = yield select()
      const resp: AxiosResponse = yield call(getAllAccesses);

      const { data } = resp;
      const { accesses } = data;

      yield put({
        type: 'saveAccesses',
        payload: accesses,
      });
    },

    *loadList({ payload = {} }, { put, call, select }) {
      payload.enterprise = yield select((s: ConnectState) => s.user.currentEnterprise);
      const lastQuires = yield select((s: ConnectState) => s.accessGroup.quires);

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

        const resp = yield call(accessGroup.index, currentQuires);

        const { data } = resp;
        if (data) {
          const listDetails = listDetailsBuild(data);
          yield put({
            type: 'saveListDetails',
            payload: listDetails,
          });

          return listDetails.list;
        }

        return null;
      } catch (e) {
        NetworkError();
        return false;
      } finally {
        yield put({
          type: 'saveListDetailsLoading',
          payload: false,
        });
        // return false;
      }
    },

    *remove({ payload }, { put, select, call }) {
      const resp: AxiosResponse = yield call(accessGroup.remove, payload);

      const { status } = resp;

      if (status === 200) {
        message.success('角色删除成功');
        yield put({
          type: 'removeOneByID',
          payload,
        });
      } else if (status === 400) {
        message.error('移除过程出现错误，请稍后再试');
      }
    },

    *update({ payload }, { put, select, call }) {
      const { id, ...restBody } = payload;

      const resp: AxiosResponse = yield call(accessGroup.update, id, restBody);

      const { status } = resp;

      if (status === 200) {
        message.success('修改成功');

        yield put({
          type: 'loadList',
        });
      }
    },
  },

  reducers: {
    saveGroupAccesses(state, { payload }) {
      return {
        ...state,
        groupAccesses: payload,
      };
    },

    saveAccesses(state, { payload }) {
      return {
        ...state,
        accesses: payload,
      };
    },

    addOne(state: IAccessGroup, { payload }) {
      const { listDetails } = state;

      listDetails.list.push(payload);
      return {
        ...state,
        listDetails,
      };
    },

    removeOneByID(state: IAccessGroup, { payload }) {
      const { listDetails } = state;

      listDetails.list = listDetails.list.filter(item => item._id !== payload);
      return {
        ...state,
        listDetails,
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

    saveListDetailsLoading(state: IAccessGroup, { payload }) {
      return {
        ...state,
        listDetails: {
          ...state.listDetails,
          loading: payload,
        },
      };
    },
  },
} as ModelType<IAccessGroup>;
