
import * as Config from 'electron-store';

export const getDirname = () => {
  // const $dirname = __dirname;
  // console.log($dirname, 'dirname');
  // return $dirname;
  return $$dirname;
}

// interface IConfig {
//   updaterPath?: string;
//   productName?: string;
// }

const config = new Config({ 
  name: 'config',
  // productName: '魔镜店+',
  // updaterPath: 'http://release.meyup.io/store',
  schema: {
    upgradePath: {
      type: 'string',
      format: 'uri',
    },
  },
  // updaterPath: 'http://release.meyup.io/store'
});

config.set('upgradePath', 'http://release.meyup.io/store');
config.set('productName', '魔镜店+');
config.set('dirname', getDirname());

export default config;