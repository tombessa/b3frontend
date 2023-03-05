import { useContext, FormEvent, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image';
import styles from '../../styles/home.module.scss';

import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { AuthContext } from '../contexts/AuthContext'
import {toast} from "react-toastify";
import {canSSRGuest} from "../utils/canSSRGuest";
// @ts-ignore
import logoImg from '../../public/index.svg';

export default function Home() {
  const { signIn } = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent){
    event.preventDefault();
    if(email ==='' || password ==='') {
      toast.error("Required fields.");
      return;
    }

    let data = {
      email,
      password
    }
    setLoading(true);
    await signIn(data)
    setLoading(false);
  }

  return (
    <>
    <Head>
      <title>Project Manager - Login</title>
    </Head>
    <div className={styles.containerCenter}>
      <Image height={240} src={logoImg} alt="Logo App" />

      <div className={styles.login}>
        <form onSubmit={handleLogin}>
          <Input
            placeholder="E-mail"
            type="text"
            value={email}
            onChange={ (e) => setEmail(e.target.value) }
          />

          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={ (e) => setPassword(e.target.value) }
          />
          
          <Button
            type="submit"
            loading={loading}
          >
            Login
          </Button>
        </form>

      </div>
    </div>
    </>
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return{
    props: {}
  }
})
