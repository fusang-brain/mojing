import { Effect } from 'dva';
import { Reducer } from 'redux';
import { AxiosResponse } from 'axios';
import { findUserInfo } from '@/services/user';
import { isStateSuccess } from '@/utils/request';
import { getCurrentEnterprise, setCurrentEnterprise } from '@/services/enterprise';
import { ConnectState } from './connect';

// import { queryCurrent, query as queryUsers } from '@/services/user';

export interface CurrentUser {
  id?: string;
  avatar?: string;
  _id?: string;
  enterprises?: string[];
  deleted?: boolean;
  phone?: string;
  realname?: string;
  notifyCount?: number;
  unreadCount?: number;
}

export interface UserModelState {
  currentUser?: CurrentUser;
  currentEnterprise?: string;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
    fetchCurrentEnterprise: Effect;
    fetchAfterLogin: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
    saveCurrentEnterprise: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {},
    *fetchAfterLogin(action, { call, put, take }) {
      // const { payload } = action;
      // const { redirect } = payload;

      yield put({
        type: 'fetchCurrent',
      });
      yield take('fetchCurrent/@@end');
      yield put({
        type: 'fetchCurrentEnterprise',
      });
      yield take('fetchCurrentEnterprise/@@end');

      return true;
    },

    *fetchCurrent(_, { call, put, take }) {
      const resp: AxiosResponse = yield call(findUserInfo);

      if (!isStateSuccess(resp)) {
        return false;
      }

      const { info } = resp.data;

      return yield put({
        type: 'saveCurrentUser',
        payload: info,
      });
    },

    *fetchCurrentEnterprise(_, { call, put, select }) {
      const user = yield select((s: ConnectState) => s.user.currentUser);
      const { enterprises = [] } = user;
      let enterprise: string = '';
      const cachedEnterprise: string = getCurrentEnterprise();

      if (enterprises && enterprises.length > 0) {
        if (enterprises.indexOf(cachedEnterprise) >= 0) {
          enterprise = cachedEnterprise;
        } else {
          enterprise = enterprises[0]._id;
        }
      }

      yield put({
        type: 'enterprise/loadEnterpriseDetailsById',
        payload: {
          id: enterprise || '',
        },
      });

      yield put({
        type: 'enterprise/saveEnterpriseList',
        payload: enterprises || [],
      });

      return yield put({
        type: 'saveCurrentEnterprise',
        payload: enterprise,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    saveCurrentEnterprise(state, action) {
      setCurrentEnterprise(action.payload);
      return {
        ...state,
        currentEnterprise: action.payload || '',
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
