import { createContext, ReactNode, useState } from 'react';

import {api, apiSocial} from '../services/apiClient';

import { destroyCookie, setCookie,  parseCookies } from 'nookies'
import Router from 'next/router';
import {toast} from "react-toastify";
import {Role} from "../utils/role";
import {signOut} from 'next-auth/react';


type AuthContextData = {
  user: LoginUserProps|undefined;
  isAuthenticated: boolean;
  signInAsSocialMedia: (credentials: SignInProps) => Promise<void>;
  signOutAsSocialMedia: () => void;
  signUp: (credentials : SignUpProps) => Promise<void>;
}

export type LoginUserProps = {
  id: string;
  name: string;
  email: string;
  role: Role;
}


type SignInProps = {
  email: string;
  password?: string;
  secret?: string;
}

type PostProps={
  url: string
  data: any
}

type SignUpProps = {
  name: string;
  email: string;
  password: string;
  role: string;
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)


export function signOutAsSocialMedia(){
  try{
    destroyCookie(undefined, '@nextauth.token')
    signOut()
    Router.push('/')    
  }catch{
    console.log('error when leaving')
  }
}

export function AuthProvider({ children }: AuthProviderProps){
  const [user, setUser] = useState<LoginUserProps>();
  const isAuthenticated = !!user;


  async function signInAsSocialMedia({ email, password, secret }: SignInProps){
    try{
      let response;
      if(password){
        response = await api.post('/session', {
          email,
          password
        })
      }else{

        let data = {email: email,
          key: secret}
        response = (await apiSocial.post('/sessionSocialMedia',
            data))
      }

      const { id, name, token, role } = response.data;

      setCookie(undefined, '@nextauth.token', token, {
        maxAge: 60*60, // Expirar em 1 hora
        path: "/" // Quais caminhos terao acesso ao cookie
      })

      setUser({
        id,
        name,
        email,
        role,
      })

      //Passar para proximas requisiçoes o nosso token
      api.defaults.headers['Authorization'] = `Bearer ${token}`
      toast.success("Welcome Back!");

      //Redirecionar o user para /dashboard
      Router.push('/dashboard')


    }catch(err){
      toast.error("Error during the login");
      console.log("Erro Login ", err);
    }
  }


  async function signUp({name, email, password, role}: SignUpProps){
    try{
      const response = await api.post('/user',{
        name,
        email,
        password,
        role
      });
      toast.success("Registration made successfully!");
    }catch(err){
      toast.error("Error during the register");
      console.log("Erro Register", err);
    }
  }
  return(
    <AuthContext.Provider value={{ user, isAuthenticated, signInAsSocialMedia, signOutAsSocialMedia, signUp }}>
      {children}
    </AuthContext.Provider>
  )
}