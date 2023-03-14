import { setupAPIClient } from "../../services/api"
import Head from 'next/head';
import {Header} from '../../components/Header';
import { toast } from "react-toastify";
import styles from './styles.module.scss'
import {canSSRAuth} from "../../utils/canSSRAuth"
import {DashboardProps} from "../../utils/props";
import {GetServerSidePropsContext} from "next";
import {ParsedUrlQuery} from "querystring";
import Loading from "../../utils/loading";
import LoadingUtil from "../../utils/loading";

export default function Dashboard({message, user}: DashboardProps){
  return(
    <>
      <Head>
        <title>Panel - Project Manger</title>
      </Head>
      <div>

        <Header name={user.name} email={user.email} id={user.id} role={user.role}/>
        <LoadingUtil/>
        <main>
        </main>
      </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx: GetServerSidePropsContext<ParsedUrlQuery, string | false | object | undefined>) => {
    const apiClient = setupAPIClient(ctx);
    const me = (await apiClient.get('/me')).data
    let send = {props:{}};
    send.props = {...send.props, message: {code: 200, message: ""},
        user: {id: me.id, name: me.name, email: me.email, role: me.role}}
    return send;
})