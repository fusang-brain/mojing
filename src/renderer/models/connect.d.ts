import { AnyAction, Dispatch, Reducer } from 'redux';
import { MenuDataItem } from '@ant-design/pro-layout';
import { RouterTypes } from 'umi';
import { GlobalModelState } from './global';
import { DefaultSettings as SettingModelState } from '../config/defaultSettings';
import { UserModelState } from './user';
import { LoginModelType } from './login';
import { Effect, Model } from 'dva';
import { IProductState } from '@/pages/product/models/product';
import { IFinanceState } from '@/pages/finance/models/finance';

export { GlobalModelState, SettingModelState, UserModelState };

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
  };
}

export interface ConnectState {
  global: GlobalModelState;
  loading: Loading;
  settings: SettingModelState;
  user: UserModelState;
  login: LoginModelType;
  product: IProductState;
  finance: IFinanceState;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch<AnyAction>;
}

export interface ModelType<T> extends Model {
  namespace: string;
  state: T;
  effects?: {
    [key: string]: Effect;
  };
  reducers?: {
    [key: string]: Reducer<T>;
  };
}

export type TheDispatch = (action: AnyAction) => Promise<any>;

export interface BaseProps {
  dispatch?: TheDispatch;
  history?: History;
  location?: Location;
  loading?: ConnectState['loading'];
}

export interface IQueryState extends IState {
  queries: { [key: string]: any };
  listDetails: IListDetails;
}

export interface IState {
  [key: string]: any;
}

export interface IListDetails {
  list: any[];
  pagination: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
  loading?: boolean;
}
