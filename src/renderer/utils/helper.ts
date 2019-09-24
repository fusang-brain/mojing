import { parse } from 'qs';
import hash from 'hash.js';
import pathToRegexp from 'path-to-regexp';
// import { IListDetails } from '@/typing/models';
// import { message } from 'antd';

// import { FormikTouched } from 'formik';
import { AnyAction } from 'redux';
import lodash from 'lodash';
// import { notify as message } from '@/components/Notifier';

/**
 * delay function
 * @param {number} time ms 毫秒
 */
export const delay = (time: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getHostname() {
  return window.location.origin || 'shop.meYup.io';
}

export function genHashcode(body: any): string {
  let str = '';
  if (typeof body === 'string') {
    str = body;
  }

  str = JSON.stringify(body);

  return hash
    .sha256()
    .update(str)
    .digest('hex');
}

export function matchUrls(urls: Array<string>, pathname: string): boolean {
  for (const u of urls) {
    if (pathToRegexp(pathname).test(u)) {
      return true;
    }
  }

  return false;
}

// export function listDetailsBuild(body: any): IListDetails {
//   const { list, page, pageSize, total } = body;

//   return {
//     list: list || [],
//     pagination: {
//       page,
//       pageSize,
//       total,
//     },
//   };
// }

// export function NetworkError() {
//   message.error('网络异常，请稍后重试');
// }

export type PowerPartial<T> = {
  [U in keyof T]?: T[U] extends object ? PowerPartial<T[U]> : T[U];
};

export function genOrderNO(prefix?: string): string {
  const t = new Date();
  const head = `${prefix || ''}`;
  const body = t.getTime() * 100000;
  const uniqueBody = Number(body) + Number(lodash.uniqueId() || 0);
  return `${head}${uniqueBody}`;
}

export function genProductCode(prefix?: string): string {
  const t = new Date();
  const head = `PD${prefix || ''}`;
  const body = t.getTime() * 100000;
  const uniqueBody = Number(body) + Number(lodash.uniqueId() || 0);
  return `${head}${uniqueBody}`;
}

// export function isTouchedAll(keys: string[], touched: FormikTouched<any>) {
//   for (const key of keys) {
//     if (!touched[key]) {
//       return false;
//     }
//   }

//   return true;
// }

export const genGenderString = (key: string) => {
  const mapper = {
    man: '男',
    female: '女',
    unknown: '未知',
  };

  return mapper[key] || '未知';
};

export const dispatch: (action: AnyAction) => Promise<any> = action => {
  const gApp = window['g_app'];
  if (gApp._store && gApp._store.dispatch) {
    return gApp._store.dispatch(action);
  }

  return null;
};

export function beautySubstr(str: string, len: number): string {
  let reg = /[\u4e00-\u9fa5]/g; //专业匹配中文
  let slice = str.substring(0, len) || '';
  let chineseCharNum = ~~(slice.match(reg) || ('' && (slice.match(reg) || '').length));
  let realen = slice.length * 2 - chineseCharNum;
  return str.substr(0, realen) + (realen < str.length ? '...' : '');
}
