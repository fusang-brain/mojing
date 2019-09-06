declare var $$dirname: string;
// declare var $dirname: string;
declare module NodeJS {
  
  interface Global {
    services: any,
    configs: any,
  }
}