
interface ServiceRequest {
  method?:string;
  body?:{[key: string]: any};
  query?:{[key: string]: any};
}

type IBody = {[key: string]: any};

type ServiceFunc = (req: ServiceRequest) => Promise<any>;