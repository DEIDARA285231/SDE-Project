import { Error } from '../types';
import qs from 'qs';
import axios from 'axios';
import secrets from '../../secrets';

axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { indices: false });
};

export const itadGetPlain: (IDSteam: number) => Promise<any | Error> = async (IDSteam) => {
  try{
    const response = await axios.get<any>('https://api.isthereanydeal.com/v01/game/plain/id/',{ params: {
      key: secrets.ITAD_KEY,
      shop: "steam",
      ids: `app/${IDSteam}`
      }})
    return response.data;
  } catch(e){
    console.error(e);
    return {
      error: e,
    };
  };
};

export const itadStoreLow: (plain: string, store: string) => Promise<any | Error> = async (plain, store) => {
  try{
    const response = await axios.get<any>('https://api.isthereanydeal.com/v01/game/storelow/',{ params: {
      key: secrets.ITAD_KEY,
      plains: plain,
      region: "eu2",
      country: "IT",
      shops: store,
      }})
    return response.data;
  } catch(e) {
    console.error(e);
    return {
      error: e,
    };
  };
};
