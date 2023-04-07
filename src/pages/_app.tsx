import '../../styles/globals.scss'
import { AppProps } from 'next/app';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from '../contexts/AuthContext'
import {SessionProvider} from "next-auth/react";
import {useState} from "react";
import {Role} from "../utils/role";

type LoginUserProps = {
    id?: string;
    name?: string;
    email?: string;
    role?: Role;
}
function MyApp({ Component, pageProps:{ session, ...pageProps} }: AppProps) {

    return (
   <SessionProvider session={session}>
       <AuthProvider>
            <Component {...pageProps} />
            <ToastContainer autoClose={3000} />
       </AuthProvider>
   </SessionProvider>
  )
}

export default MyApp
