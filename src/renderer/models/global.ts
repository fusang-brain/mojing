import { Reducer } from 'redux';
import { Subscription, Effect } from 'dva';

import { NoticeIconData } from '@/components/NoticeIcon';
// import { queryNotices } from '@/services/user';
import { ConnectState } from './connect.d';
import { findOperators } from '@/services/user';

export interface NoticeItem extends NoticeIconData {
  id: string;
  type: string;
  status: string;
}

export interface Operator {
  _id: string;
  realname: string;
}

export interface GlobalModelState {
  collapsed: boolean;
  notices: NoticeItem[];
  operators: Operator[];
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    fetchNotices: Effect;
    clearNotices: Effect;
    changeNoticeReadState: Effect;
    loadOperators: Effect;
  };
  reducers: {
    changeLayoutCollapsed: Reducer<GlobalModelState>;
    saveNotices: Reducer<GlobalModelState>;
    saveClearedNotices: Reducer<GlobalModelState>;
    saveOperators: Reducer<GlobalModelState>;
  };
  subscriptions: { setup: Subscription };
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    operators: [],
  },

  effects: {
    *fetchNotices(_, { call, put, select }) {
      // const data = yield call(queryNotices);
      // yield put({
      //   type: 'saveNotices',
      //   payload: data,
      // });
      // const unreadCount: number = yield select(
      //   (state: ConnectState) => state.global.notices.filter(item => !item.read).length,
      // );
      // yield put({
      //   type: 'user/changeNotifyCount',
      //   payload: {
      //     totalCount: data.length,
      //     unreadCount,
      //   },
      // });
    },

    *loadOperators(action, effects) {
      const { select, call, put } = effects;
      const enterprise = yield select((s: ConnectState) => s.user.currentEnterprise);
      if (!enterprise) {
        yield put({
          type: 'saveOperators',
          payload: [],
        });
        return;
      }

      try {
        const resp = yield call(findOperators, enterprise);

        const { data } = resp;

        yield put({
          type: 'saveOperators',
          payload: data,
        });
      } catch (e) {
        yield put({
          type: 'saveOperators',
          payload: [],
        });
      }
      return;
    },

    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count: number = yield select((state: ConnectState) => state.global.notices.length);
      const unreadCount: number = yield select(
        (state: ConnectState) => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },
    *changeNoticeReadState({ payload }, { put, select }) {
      const notices: NoticeItem[] = yield select((state: ConnectState) =>
        state.global.notices.map(item => {
          const notice = { ...item };
          if (notice.id === payload) {
            notice.read = true;
          }
          return notice;
        }),
      );

      yield put({
        type: 'saveNotices',
        payload: notices,
      });

      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }): GlobalModelState {
      return {
        operators: [],
        notices: [],
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }): GlobalModelState {
      return {
        operators: [],
        collapsed: false,
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(
      state = { notices: [], collapsed: true, operators: [] },
      { payload },
    ): GlobalModelState {
      return {
        collapsed: false,
        ...state,
        notices: state.notices.filter((item): boolean => item.type !== payload),
      };
    },

    saveOperators(
      state = { notices: [], collapsed: true, operators: [] },
      { payload },
    ): GlobalModelState {
      return {
        ...state,
        operators: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }): void {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }): void => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};

export default GlobalModel;
