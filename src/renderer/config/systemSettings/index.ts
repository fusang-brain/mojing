import path from 'path';
import production from './prod';
import development from './local';
import defaultConfig from './default';
// import { IConfig } from './types';
// import { PowerPartial } from '@/utils/helper';

let nodeENV = null;
try {
  nodeENV = process.env.NODE_ENV || process.env.CONFIG_ENV;
} catch (err) {
  nodeENV = null;
}


// export default {
//   rootPath: path.resolve(__dirname, 'src/'),
//   ...defaultConfig,
//   ...development,
//   ...(nodeENV !== 'development' && production),
// };

type SettingType = (typeof defaultConfig) & (typeof development) & (typeof production);

export default Object.assign({}, {rootPath: path.resolve(__dirname, 'src/')}, defaultConfig, development, (nodeENV !== 'development' ? production : {})) as SettingType;