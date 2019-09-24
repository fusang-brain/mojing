// import { notification } from 'antd';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import hash from 'hash.js';
import router from 'umi/router';
// import { getAccessToken } from './Authorize';

import config from '@/config/systemSettings';
import { join } from 'path';
import { getCurrentEnterprise } from './Authorized';
import { getAccessToken } from './Authorized';
import { message } from 'antd';
// import { notify as message } from '@/components/Notifier';

const codeMessage: { [key: number]: string } = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const checkStatus = (response: AxiosResponse) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  // message.error({
  //   message: `请求错误 ${response.status}: ${response.config.url}`,
  //   description: errortext,
  // });
  // message.error(`请求错误 ${response.status}: ${response.config.url}`);
  const error = new Error(errortext);

  // error.name = response.status;
  throw error;
};

const saveCache = (response: AxiosResponse, hashcode: string) => {
  const stringResp = JSON.stringify(response);
  sessionStorage.setItem(hashcode, stringResp);
  sessionStorage.setItem(`${hashcode}:timestamp`, String(Date.now()));
};

export interface IRequestOptions extends AxiosRequestConfig {
  expirys?: boolean | number;
}

export default async function request(url: string, opt: IRequestOptions) {
  if (!url.startsWith('http://')) {
    // console.log(config.apiHost, 'apiHost ...');
    url = `${config.apiHost}${join('/', url)}`;
    // console.log(url, 'apiHost joined ....');
  }

  const defaultOptions: IRequestOptions = {
    expirys: false,
    method: 'get',
    headers: {},
    withCredentials: true, // 请求时带上 cookie
  };

  const options: IRequestOptions = { ...defaultOptions, ...opt };
  // inject accesstoken
  const token = getAccessToken();
  const enterprise = getCurrentEnterprise();
  if (token) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`;
  }

  if (enterprise) {
    defaultOptions.headers['MeYupEnterprise'] = `${enterprise}`;
  }

  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint = url + (options.params ? JSON.stringify(options.params) : '');
  +(options.data ? JSON.stringify(options.data) : '');

  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');

  const { expirys = 60, method, url: reqUrl, ...axiosProps } = options;

  // options expirys !== false, return cache
  if (options.expirys !== false) {
    const cached = sessionStorage.getItem(hashcode);
    const whenCached: number = Number(sessionStorage.getItem(`${hashcode}:timestamp`));
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        return JSON.parse(cached) as AxiosResponse;
      }
      sessionStorage.removeItem(hashcode);
      sessionStorage.removeItem(`${hashcode}:timestamp`);
    }
  }

  try {
    const resp = await axios({
      method,
      baseURL: window.location.origin,
      url,
      ...axiosProps,
    });

    checkStatus(resp);
    saveCache(resp, hashcode);
    return resp;
  } catch (e) {
    // console.log(e, 'errr');

    const { response } = e;

    if (!response) {
      throw e;
    }

    const { data, status } = response;
    if (status === 401) {
      const { error } = data;

      if (error === 'not found the user') {
        message.error('不存在该用户');
        // return;
      }

      // @HACK
      /* eslint-disable no-underscore-dangle */
      window['g_app']._store.dispatch({
        type: 'login/logout',
      });
      // return;
    }
    // environment should not be used
    if (status === 403) {
      router.push('/exception/403');
      // return;
    }

    if (status <= 504 && status >= 500) {
      router.push('/exception/500');
      // return;
    }

    if (status >= 404 && status < 422) {
      const { error } = data;

      if (error === 'not found the user') {
        message.error('不存在该用户');
        return;
      }

      router.push('/exception/404');
      // return;
    }

    if (status === 422) {
      message.error('服务器处理您提交的数据时出现错误，请提交正确的数据!');
      return response;
    }

    // throw response;
    return response;
  }
}

export function isStateSuccess(resp: AxiosResponse) {
  const { status } = resp;

  if (parseInt(`${status / 100}`, 10) === 2) {
    return true;
  }

  return false;
}
