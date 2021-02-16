import { Error } from '../types';
import qs from 'qs';
import axios from 'axios';

axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { indices: false });
};

export const getPriceSteam: (id: number) => Promise<any | Error> = async (id) => {
  try {
    const response = await axios.get<any>(`https://store.steampowered.com/api/appdetails?appids=${id}&currency=eur`);
    return response.data;
  } catch(e) {
    console.error(e);
    return {
      error: e,
    };
  };
}

export const getActivePlayersSteam: (id: number) => Promise<any | Error> = async (id) => {
  try{
    const response = await axios.get<any>(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${id}`);
    return response.data;
  } catch(e) {
    console.error(e);
    return {
      error: e,
    };
  };
};
