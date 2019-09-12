import { Effect } from 'dva';
import { Reducer } from 'redux';
import { AxiosResponse } from 'axios';
import { findUserInfo } from '@/services/user';
import { isStateSuccess } from '@/utils/request';
import { getCurrentEnterprise, setCurrentEnterprise } from '@/services/enterprise';
import { ConnectState } from './connect';
import { routerRedux } from 'dva/router';

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
    *fetch(_, { call, put }) {
      // console.log('fetch user');
      // const response = yield call(queryUsers);
      // console.log(response);
      // yield put({
      //   type: 'save',
      //   payload: {
      //     status: 'ok',
      //     type: 'mobile',
      //     currentAuthority: 'user',
      //   },
      // });
      // yield put({
      //   type: 'fetchCurrent',
      // });
    },
    *fetchAfterLogin(action, { call, put, take }) {
      const { payload } = action;
      const { redirect } = payload;

      yield put({
        type: 'fetchCurrent',
      });
      yield take('fetchCurrent/@@end');
      yield put({
        type: 'fetchCurrentEnterprise',
      });

      yield put(routerRedux.replace(redirect || '/'));
    },
    *fetchCurrent(_, { call, put, take }) {
      console.log('fetch current');

      const resp: AxiosResponse = yield call(findUserInfo);

      if (!isStateSuccess(resp)) {
        return false;
      }

      const { info } = resp.data;
      const { enterprises } = info;

      if (enterprises.length <= 0) {
        yield put({
          type: 'saveCurrentUser',
          payload: info,
        });

        yield take('saveCurrentUser/@@end');

        yield put(routerRedux.replace('/enterprise/create'));

        return false;
      }

      return yield put({
        type: 'saveCurrentUser',
        payload: info,
      });
    },

    *fetchCurrentEnterprise(_, { call, put, select }) {
      console.log('fetch current enterprise');
      // const { put, call, select } = effects;
      const user = yield select((s: ConnectState) => s.user.currentUser);
      const { enterprises = [] } = user;

      let enterprise: string = yield call(getCurrentEnterprise);

      if (!enterprise || enterprise === undefined) {
        enterprise = enterprises[0];
      }

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
