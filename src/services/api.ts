import axios, { AxiosError } from 'axios'
import { parseCookies } from 'nookies'
import { AuthTokenError } from './errors/AuthTokenError'

import { signOutAsSocialMedia } from '../contexts/AuthContext'
import {GetServerSidePropsContext} from "next";
import {BASE_URL, SECRET} from "../utils/constants";

export function setupAPIClient(ctx?: GetServerSidePropsContext){
  let cookies = parseCookies(ctx);
  const url = BASE_URL;
  if (url === undefined) {
    const message = `The environment variable "${url}" cannot be "undefined".`;
    throw new Error(message);
  }
  const api = axios.create({
    baseURL: url,
    headers: {
      Authorization: `Bearer ${cookies['@nextauth.token']}`
    }
  })

  api.interceptors.response.use((response: any) => {
    return response;
  }, (error: AxiosError) => {
    if(error.response!==undefined)
    if(error.response.status === 401){
      // qualquer erro 401 (nao autorizado) devemos deslogar o usuario
      if(typeof window !== undefined){
        // Chamar a funçao para deslogar o usuario
        signOutAsSocialMedia();
      }else{
        return Promise.reject(new AuthTokenError())
      }
    }

    return Promise.reject(error);

  })

  return api;

}

export function setupAPISocialMedia(baseUrl?: string, ctx?: GetServerSidePropsContext ){
  const url = baseUrl;
  if (url === undefined) {
    const message = `The environment variable "${url}" cannot be "undefined".`;
    throw new Error(message);
  }
  const api = axios.create({
    baseURL: url,
  })

  api.interceptors.response.use((response: any) => {
    return response;
  }, (error: AxiosError) => {
    if(error.response!==undefined)
      if(error.response.status === 401){
        // qualquer erro 401 (nao autorizado) devemos deslogar o usuario
        if(typeof window !== undefined){
          // Chamar a funçao para deslogar o usuario
          signOutAsSocialMedia();
        }else{
          return Promise.reject(new AuthTokenError())
        }
      }

    return Promise.reject(error);

  })

  return api;

}