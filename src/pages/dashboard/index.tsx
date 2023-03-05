import { setupAPIClient } from "../../services/api"
import Head from 'next/head';
import {Header} from '../../components/Header';
import styles from './styles.module.scss'
import {canSSRAuth} from "../../utils/canSSRAuth"
import {canSSRGuest} from "../../utils/canSSRGuest"

export default function Dashboard(){
  
  return(
    <>
      <Head>
        <title>Panel - Project Manger</title>
      </Head>
      <div>
        
        <Header/>
        <main>

        </main>
      </div>
    </>
  )
}

export const getServerSideProps = canSSRGuest(async () => {
  return{
    props: {}
  }
})