// import { IConfig } from './setting';
// import { PowerPartial } from '@/utils/helper';
// import { IDict } from '@/typing/models';

const packageInfo = require('../../../../package.json');

// const DefaultConfig: PowerPartial<IConfig> = {
//   host: '',
// }

export default {
  versionCode: '00001',
  fingerprint: '00001',
  host: '',
  userLayouts: [
    '/user/login',
    '/user/register',
  ],
  loginPath: '/user/login',
  registerPath: '/user/register',
  productName: packageInfo.productName,
  colors: {
    red: '#f50',
    blue0: '#2db7f5',
    blue001: '#5968d5',
    blue002: '#5E8FE2',
    blue003: '#5ed1e2',
    blue004: '#59d5c6',
    kind01: '#4691bf',
    kind02: '#83c6ef',
    kind03: '#ef9058',
    kind04: '#efab83',
    green: '#87d068',
    blue: '#108ee9',
    primary: '#7985E3',
  },
  stateMapper: {
    productKind: ['普通商品', '镜片', '隐形眼镜', '服务'],
    productCategory: {
      'glassesFrame': '镜框',
      'presbyopicGlasses': '老花镜',
      'sunGlasses': '太阳镜',
      'contactLenses': '隐形眼镜',
      'contactLensesSolutions': '护理液',
    },
  },
};

// export default (): PowerPartial<IConfig> => ({
  
// });
