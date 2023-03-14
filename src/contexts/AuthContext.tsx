import { createContext, ReactNode, useState } from 'react';

import { api } from '../services/apiClient';

import { destroyCookie, setCookie,  parseCookies } from 'nookies'
import Router from 'next/router';
import {toast} from "react-toastify";
import {SignUpRowDataProps} from "../utils/props";


type AuthContextData = {
  user: LoginUserProps|undefined;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credentials : SignUpProps) => Promise<void>;
}

export type LoginUserProps = {
  id: string;
  name: string;
  email: string;
  role: Role;
}
export type Role = typeof Role[keyof typeof Role];

export const Role: {
  USER: 'USER'
  ADMIN: 'ADMIN'
} = {
  USER: 'USER',
  ADMIN: 'ADMIN',
}

type SignInProps = {
  email: string;
  password: string;
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


export function signOut(){
  try{
    destroyCookie(undefined, '@nextauth.token')
    Router.push('/')    
  }catch{
    console.log('error when leaving')
  }
}

export function AuthProvider({ children }: AuthProviderProps){
  const [user, setUser] = useState<LoginUserProps>();
  const isAuthenticated = !!user;


  async function signIn({ email, password }: SignInProps){
    try{
      const response = await api.post('/session', {
        email,
        password
      })

      const { id, name, token, role } = response.data;
      console.log("1");
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
      const response = await api.post('/users',{
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
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  )
}