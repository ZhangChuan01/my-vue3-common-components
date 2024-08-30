// 后端返回接口,params示例
declare namespace Api {
  interface Result<T = any> {
    code: number;
    message: string;
    data: T;
  }
  interface ParamsDemo {
    test: string;
  }
}

