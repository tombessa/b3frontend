import {FormEvent, useContext, useState} from "react";
import Head from 'next/head'
import Image from 'next/image';
import styles from '../../../styles/home.module.scss';
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import Link from 'next/link';
import { AuthContext } from '../../contexts/AuthContext';
import {toast} from "react-toastify";
// @ts-ignore
import logoImg from '../../../public/index.svg';

export default function SignUp() {
  const {signUp} = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp(event: FormEvent){
    event.preventDefault();
    if(name==='' || email ==='' || password==='') {
      toast.error("Required Fields.");
      return;
    }
    setLoading(true);
    let data = {
      name,
      email,
      password
    }
    await signUp(data);
    setLoading(false);
  }

  return (
    <>
    <Head>
      <title>User Registration</title>
    </Head>
    <div className={styles.containerCenter}>
      <Image height={240} src={logoImg} alt="Logo" />

      <div className={styles.login}>
        <h1>Register</h1>

        <form onSubmit={handleSignUp}>
          <Input
            placeholder="Name"
            type="text"
            value={name}
            onChange={ (e) => setName(e.target.value) }
          />

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
            Register
          </Button>
        </form>


      </div>
    </div>
    </>
  )
}
