import {FormEvent, useContext, useMemo, useState} from "react";
import Head from 'next/head'
import styles from '../../../styles/home.module.scss';
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import {AuthContext} from '../../contexts/AuthContext';
import {toast} from "react-toastify";
import {canSSRAuth} from "../../utils/canSSRAuth";
import {GetServerSidePropsContext} from "next";
import {ParsedUrlQuery} from "querystring";
import {setupAPIClient} from "../../services/api";
import {Header} from "../../components/Header";
import { ComboBox} from "../../components/ui/ComboBox";
import {GenericMaterialTableProps, GenericTable} from "../../components/ui/Table";
import {handleRowUpdate#Entity#} from "../../utils/handleUpdate";
import {handleRowGet#Entity#} from "../../utils/handleGet";
import {handleRowDelete#Entity#} from "../../utils/handleDelete";

import {#entity_lower#Column} from "../../utils/columns";

export type #Entity#Props={
    #COL_DEFINED#
}

export interface #Entity#RowDataProps extends #Entity#Props, RowData {

}

export type #Entity#Props = {
    dashboard: DashboardProps
    #entity_lower#s: #Entity#RowDataProps[]
}

export default function #Entity#({dashboard, #entity_lower#s}: #Entity#Props) {
  const {signUp} = useContext(AuthContext);
  
  #USE_STATE_INI#
  /*
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('USER');
  const [password, setPassword] = useState('');
  */
  
  const [loading, setLoading] = useState(false);
  const [#entity_lower#Item, set#Entity#Item] = useState<#Entity#RowDataProps>();
  const [#entity_lower#Selected, set#Entity#Selected] = useState<#Entity#RowDataProps>();
  const [rest, setRest] = useState<GenericMaterialTableProps>();
  const[list#Entity#, setList#Entity#] = useState<#Entity#RowDataProps[]>([]);

  function clearForm(){
    #USE_STATE_INI#
	/*
	setName('');
    setEmail('');
    setRole('USER');
    setPassword('');
	*/
  }

  async function handle#Entity#(event: FormEvent){
    event.preventDefault();
    #REQUIRED_FIELDS_IF#
      toast.error("Required Fields.");
      return;
    }
    setLoading(true);
    let data = {
      #FIELDS_INI#
    }
    await signUp(data);
    let new#Entity# = await handleRowGet#Entity#();    
    setList#Entity#(new#Entity#);
    setLoading(false);
    clearForm();
  }

  useMemo(async () => {
    setList#Entity#(#entity_lower#s);
  },[]);

  useMemo(()=>{
    setRest({
      columns: #entity_lower#Column(),
      data: list#Entity#,
      handleRowDelete: handleRowDelete#Entity#,
      handleRowUpdate: handleRowUpdate#Entity#,
      setData: set#Entity#Item,
      options: {
        pageSize: 10
      }
    });
  },[list#Entity#]);

  const table#Entity#=useMemo(()=>{
    return(<GenericTable rest={rest} setRest={setRest} selectedRow={#entity_lower#Selected} setSelectedRow={set#Entity#Selected} />);
  },[rest, #entity_lower#Selected, set#Entity#Selected]);

  return (
    <>
    <Head>
      <title>#Entity# - Page</title>
    </Head>
    <Header 
		name={dashboard.user.name} 
		email={dashboard.user.email} 
		id={dashboard.user.id} 
		role={dashboard.user.role}/>

    <div className={styles.containerCenter}>
      <div className={styles.default}>
        <div>#Entity# - Page</div>
        <form onSubmit={handle#Entity#}>
          #FORM_ITEMS#
          <Button
            type="submit"
            loading={loading}
          >
            Register
          </Button>
        </form>


      </div>
      <div className={styles.containerGrid}>{table#Entity#}</div>
    </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx: GetServerSidePropsContext<ParsedUrlQuery, string | false | object | undefined>) => {
  const apiClient = setupAPIClient(ctx);
  const me = (await apiClient.get('/me')).data
  const #entity_lower#s : #Entity#RowDataProps[] = (await apiClient.get('/#entity_lower#s')).data
  let send = {props:{}};
  send.props = {...send.props, dashboard: {message: {code: 200, message: ""},
      #entity_lower#: {id: me.id, name: me.name, email: me.email, role: me.role}},
    #entity_lower#s: #entity_lower#s};
  return send;
})