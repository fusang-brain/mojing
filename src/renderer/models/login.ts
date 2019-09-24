// import { Reducer } from 'redux';
import { routerRedux } from 'dva/router';
import { Effect } from 'dva';
import { stringify } from 'querystring';

import { setRememberMe, isRememberMe, accountLogin, clearRememberMe } from '@/services/login';
import {
  reloadAuthorization,
  Authorization,
  setAuthorization,
  getAuthorization,
  getAuthHash,
  getAuthHashFromSession,
  clearAuthorization,
} from '@/utils/Authorized';
import { getPageQuery } from '@/utils/utils';

import { setCurrentEnterprise } from '@/services/enterprise';
import { AxiosResponse } from 'axios';
import { ModelType } from './connect';
import { message } from 'antd';
import { ServiceRequest } from '@/services';
// import { router } from 'umi';

// async function findCurrentEnterprise(id: string) {
//   const resp: AxiosResponse = await getEnterpriseByUserID(id);

//   const { data } = resp;

//   const { list: enterprises } = data;

//   let enterprise: string = '';

//   const cachedEnterprise = getCurrentEnterprise();

//   // console.log(cachedEnterprise, 'cachedEnterprise');

//   if (enterprises && enterprises.length > 0) {
//     if (enterprises.indexOf(cachedEnterprise) >= 0) {
//       enterprise = cachedEnterprise;
//     } else {
//       enterprise = enterprises[0]._id;
//     }
//   }

//   return {
//     enterprise,
//     enterprises: enterprises,
//   };
// }

export interface StateType {
  status?: 'ok' | 'error';
  // type?: string;
  // currentAuthority?: 'user' | 'guest' | 'admin';
  token?: string;
  authority?: 'user' | 'guest' | 'admin';
  user_id?: string;
  rememberMe?: boolean;
}

export interface LoginModelType extends ModelType<StateType> {
  namespace: string;
  state: StateType;
  effects: {
    autoLogin: Effect;
    login: Effect;
    getCaptcha: Effect;
    logout: Effect;
    doLogin: Effect;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    token: undefined,
    authority: 'guest',
    user_id: undefined,
    rememberMe: false,
  },

  subscriptions: {
    setup({ dispatch }) {
      // 自动登录
      dispatch({
        type: 'autoLogin',
      });
    },
  },

  effects: {
    *login({ payload }, { call, put }) {
      const { rememberMe } = payload;
      const resp: AxiosResponse = yield call(accountLogin, {
        body: payload,
      } as ServiceRequest);

      if (!resp) {
        return;
      }

      const { status } = resp;

      if (status === 201) {
        const {
          data: {
            token = '',
            authority,
            authorization: { user_id },
          },
        } = resp;

        // const enterprise = yield call(findCurrentEnterprise, user_id);

        yield put({
          type: 'doLogin',
          payload: {
            token,
            authority,
            user_id,
            rememberMe,
            // currentEnterprise: enterprise,
          },
        });
      } else if (status === 404) {
        // notify.warning('不存在该账户');
        message.error('不存在该账户');
      } else {
        // notify.error('您的账号或密码错误');
        message.error('您的账号或密码错误');
      }
    },

    *autoLogin({ payload }, { call, put }) {
      // load authorization signature from session
      const authSignature = getAuthHashFromSession();

      // 当前会话应该不处于登录状态
      if (authSignature !== getAuthHash() && !isRememberMe()) {
        // logout
        yield put({
          type: 'logout',
        });
        return;
      }

      // load authorization
      const authorization = getAuthorization();
      // const currentEnterprise = getCurrentEnterprise();

      const { token, authority, uid: user_id } = authorization;
      // const enterprise = yield call(findCurrentEnterprise, user_id);
      console.log('自动登录');
      yield put({
        type: 'doLogin',
        payload: {
          token,
          authority,
          user_id,
          // currentEnterprise: enterprise,
        },
      });
    },

    // 执行统一登录操作
    *doLogin({ payload }, { call, put }) {
      // console.log('doLogin');
      const {
        token,
        authority,
        user_id,
        rememberMe,
        // currentEnterprise,
      } = payload as StateType;

      const ok = !!user_id;
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: ok ? 'ok' : 'error',
          currentAuthority: authority,
          user_id,
          token,
          rememberMe,
        },
      });

      if (ok) {
        // reloadAuthorized();
        reloadAuthorization();

        // const { enterprise: currentEnterprise, enterprises } = yield call(
        //   findCurrentEnterprise,
        //   user_id,
        // );
        yield put({
          type: 'setting/resetFingerprint',
          payload: user_id,
        });
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();

        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        console.log('统一登录', redirect);
        yield put(routerRedux.replace(redirect || '/welcome'));
      } else {
        message.error('登录过程中出现错误!');
      }
    },

    *getCaptcha({ payload }, { call }) {
      // yield call(getFakeCaptcha, payload);
    },

    *logout({ noRedirect = false }, { put }) {
      const { redirect } = getPageQuery();
      clearAuthorization();
      clearRememberMe();
      setCurrentEnterprise('');

      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: noRedirect
              ? undefined
              : stringify({
                  redirect: window.location.href,
                }),
          }),
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      // return {
      //   ...state,
      //   status: payload.status,
      //   type: payload.type,
      // };

      const { rememberMe } = payload;

      const auth: Authorization = {
        authority: payload.currentAuthority || 'guest',
        token: payload.token,
        uid: payload.user_id,
      };

      setAuthorization(auth);

      if (rememberMe) {
        setRememberMe(auth);
      }

      return {
        ...state,
        status: payload.status,
        currentAuthority: payload.currentAuthority,
        token: payload.token,
        uid: payload.user_id,
      };
    },
  },
};

export default Model;
