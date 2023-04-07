import {useContext, FormEvent, useState, useMemo} from 'react'
import Head from 'next/head'
import Image from 'next/image';
import styles from '../../styles/home.module.scss';
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import {toast} from "react-toastify";
import {canSSRGuest} from "../utils/canSSRGuest";
import logoImg from '../../public/index.svg';
import {getSession, signIn} from 'next-auth/react';
import {FiGithub, FiFacebook, FiInstagram} from 'react-icons/fi';
import {AuthContext} from "../contexts/AuthContext";
import {HomeProps} from "../utils/props";
import {SECRET, USE_FACEBOOK_LOGIN, USE_GITHUB_LOGIN, USE_INSTAGRAM_LOGIN, USE_SOCIAL_LOGIN} from "../utils/constants";


export default function Home({message, user, socialLogin, useSocialLogin,useGitHubLogin,useFacebookLogin,useInstagramLogin }: HomeProps) {
  const { signInAsSocialMedia } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  useMemo(()=>{
    if(socialLogin)
      if(user)
        if((user.email)&&(user.secret)){
          signInAsSocialMedia({email: user?.email, secret: user?.secret});
        }
  },[]);

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
    await signInAsSocialMedia(data)
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
        {useSocialLogin?(
            <div className={styles.social}>
              {useGitHubLogin?(
                  <Button
                    className={styles.buttonGitHub}
                    onClick={() => {signIn('github')}}>
                    <FiGithub className={styles.buttonGitHub} />
                  </Button>)
              :""}
              {useFacebookLogin?(
                  <Button
                      className={styles.buttonFacebook}
                      onClick={() => {signIn('facebook')}}>
                    <FiFacebook className={styles.buttonFacebook} />
                  </Button>
              ):""}
              {useInstagramLogin?(
                  <Button
                      className={styles.buttonInstagram}
                      onClick={() => {signIn('instagram')}}>
                    <FiInstagram className={styles.buttonInstagram} />
                  </Button>
              ):""}
            </div>
        ):""}
      </div>
    </div>
    </>
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  try {
    const session = await getSession(ctx);

    if(session){
      if(session.user) if(session.user.email){
        let send = {props:{}};
        send.props = {...send.props, message: {code: 200, message: ""},
          user: {name: session.user.name, email: session.user.email, secret: SECRET},
          socialLogin: true,
          useSocialLogin: USE_SOCIAL_LOGIN==="true",
          useGitHubLogin: USE_GITHUB_LOGIN==="true",
          useFacebookLogin: USE_FACEBOOK_LOGIN==="true",
          useInstagramLogin: USE_INSTAGRAM_LOGIN==="true"
        }
        return send;
      }
    }
  }catch(e){ console.log("erro de login")}
  return{
    props: {socialLogin: false,
      useSocialLogin: USE_SOCIAL_LOGIN==="true",
      useGitHubLogin: USE_GITHUB_LOGIN==="true",
      useFacebookLogin: USE_FACEBOOK_LOGIN==="true",
      useInstagramLogin: USE_INSTAGRAM_LOGIN==="true"}
  }
})
