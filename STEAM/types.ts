export interface Error {
    error: any;
  }
  
  export const isError = (arg: any): arg is Error => {
    return arg && arg.error;
  };
  