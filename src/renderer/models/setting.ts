import { message } from 'antd';
import defaultSettings, { DefaultSettings } from '../config/defaultSettings';
import themeColorClient from '../components/SettingDrawer/themeColorClient';
import { ModelType } from './connect';
import { SystemSettingType } from '@/config/systemSettings';
import Fingerprint from '@/utils/Fingerprint';
import { getHostname } from '@/utils/helper';

export interface SettingModelType extends ModelType<DefaultSettings> {
  namespace: 'settings';
}

const updateTheme = (newPrimaryColor?: string) => {
  if (newPrimaryColor) {
    const timeOut = 0;
    const hideMessage = message.loading('正在切换主题！', timeOut);
    themeColorClient.changeColor(newPrimaryColor).finally(() => hideMessage());
  }
};

const updateColorWeak: (colorWeak: boolean) => void = colorWeak => {
  const root = document.getElementById('root');
  if (root) {
    root.className = colorWeak ? 'colorWeak' : '';
  }
};

const SettingModel: SettingModelType = {
  namespace: 'settings',

  state: defaultSettings,

  subscriptions: {
    setup({ dispatch }) {
      const fingerprint = Fingerprint.init({
        hostname: getHostname(),
        uid: 'guest',
      });

      // 设置站点指纹
      dispatch({
        type: 'preload',
        fingerprint,
      });
    }
  },

  effects: {
    *preload({ fingerprint }, { put }) {
      yield put({
        type: 'saveFingerprint',
        payload: fingerprint,
      });
    },
  },

  reducers: {

    resetFingerprint(state = defaultSettings, { payload: payl }) {
      // const conf: PowerPartial<IConfig> = state.conf;
      const systemSettings: Partial<SystemSettingType> = state.systemSettings;
      
      // systemSettings.fingerprint = payl;

      Fingerprint.reset({
        hostname: getHostname(),
        uid: payl,
      });

      systemSettings.fingerprint = Fingerprint.fingerprint;

      return {
        ...state,
        ...{
          systemSettings,
        } as DefaultSettings
      }
    },

    saveFingerprint(state = defaultSettings, { payload }) {
      const systemSettings: Partial<SystemSettingType> = state.systemSettings;
      
      systemSettings.fingerprint = payload;
      // systemSettings
      return {
        ...state,
        ...{
          systemSettings,
        } as DefaultSettings,
      };
    },

    // 待作废
    getSetting(state = defaultSettings) {
      const setting: Partial<DefaultSettings> = {};
      const urlParams = new URL(window.location.href);
      Object.keys(state).forEach(key => {
        if (urlParams.searchParams.has(key)) {
          const value = urlParams.searchParams.get(key);
          setting[key] = value === '1' ? true : value;
        }
      });
      const { primaryColor, colorWeak } = setting;

      if (primaryColor && state.primaryColor !== primaryColor) {
        updateTheme(primaryColor);
      }
      updateColorWeak(!!colorWeak);
      return {
        ...state,
        ...setting,
      };
    },

    // 修改设置
    changeSetting(state = defaultSettings, { payload }) {
      const urlParams = new URL(window.location.href);
      Object.keys(defaultSettings).forEach(key => {
        if (urlParams.searchParams.has(key)) {
          urlParams.searchParams.delete(key);
        }
      });

      Object.keys(payload).forEach(key => {
        if (key === 'collapse') {
          return;
        }
        let value = payload[key];
        if (value === true) {
          value = 1;
        }
        if (defaultSettings[key] !== value) {
          urlParams.searchParams.set(key, value);
        }
      });
      const { primaryColor, colorWeak, contentWidth } = payload;
      if (primaryColor && state.primaryColor !== primaryColor) {
        updateTheme(primaryColor);
      }
      if (state.contentWidth !== contentWidth && window.dispatchEvent) {
        window.dispatchEvent(new Event('resize'));
      }
      updateColorWeak(!!colorWeak);
      window.history.replaceState(null, 'setting', urlParams.href);
      return {
        ...state,
        ...payload,
      };


    },
  },
};

export default SettingModel;
