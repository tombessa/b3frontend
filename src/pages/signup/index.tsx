import { FormEvent, useContext, useMemo, useState, } from 'react';
import Head from 'next/head'
import styles from '../../../styles/home.module.scss';
import {AuthContext, Role} from '../../contexts/AuthContext';
import {canSSRAuth} from "../../utils/canSSRAuth";
import {GetServerSidePropsContext} from "next";
import {ParsedUrlQuery} from "querystring";
import {setupAPIClient} from "../../services/api";
import {Header} from "../../components/Header";
import {GenericMaterialTableProps, GenericTable} from "../../components/ui/Table";
import {userColumn} from "../../utils/columns";
import {handleRowGetUser} from "../../utils/handleGet";
import {handleRowDeleteUser} from "../../utils/handleDelete";
import { Form, ItemFormProps, TYPEELEMENT, ACTIONFORM } from '../../components/ui/Form/index';
import { DashboardProps, RowData } from '../../utils/props';
import { ModalDash } from '../../components/Modal';

export interface SignUpRowDataProps extends UserProps, RowData {

}

export type EnumProps = {
  id: string;
  value: string;
}

export type UserProps={
  id?: string
  name?: string
  email?: string
  password?: string
  role?: string
  try?: number
  blocked?: boolean
  active?: boolean
}

export type SignUpProps = {
  dashboard: DashboardProps
  users: SignUpRowDataProps[]
  roles: EnumProps[]
}

export default function SignUp({dashboard, users, roles}: SignUpProps) {
  const {signUp} = useContext(AuthContext);
  
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    role: Role.USER
  });

  const [loading, setLoading] = useState(false);
  const [userItem, setUserItem] = useState<SignUpRowDataProps>();
  const [userSelected, setUserSelected] = useState<SignUpRowDataProps>();
  const [rest, setRest] = useState<GenericMaterialTableProps>();
  const[listUsers, setListUsers] = useState<SignUpRowDataProps[]>([]);

  function clearForm(){
    setUser({
      name: '',
      email: '',
      password: '',
      role: Role.USER
    });
  }


  useMemo(async () => {
    setListUsers(users);
  },[]);

  useMemo(()=>{
    setRest({
      columns: userColumn(),
      data: listUsers,
      handleRowDelete: handleRowDeleteUser,
      setData: setUserItem,
      options: {
        pageSize: 10
      }
    });
  },[listUsers]);

  function getFieldsUpdate(param: any):ItemFormProps[]{
    let ret : ItemFormProps[] = [{
      typeDiv: TYPEELEMENT.INPUTBOX,
      type: "text",
      required: true,
      label: "Id",
      autoComplete: "off",
      placeholder: "Id",
      jsonAttribute: "id",
      value: param.id,
      disabled:true
    }];
    let register  = getFieldsRegister(param);
    register.forEach(t=>ret.push(t));

    ret.push({
      typeDiv: TYPEELEMENT.CHECKBOX,
      type: "checkbox",
      required: true,
      label: "Blocked",
      autoComplete: "off",
      placeholder: "Blocked",
      jsonAttribute: "blocked",
      value: param.blocked,
      disabled:false
    });
    return ret;
  }

  function getFieldsRegister(param: any):ItemFormProps[]{
    const ret : ItemFormProps[] = [{
      typeDiv: TYPEELEMENT.INPUTBOX,
      type: "text",
      required: true,
      label: "Name",
      autoComplete: "off",
      placeholder: "Name",
      jsonAttribute: "name",
      value: param.name,
      disabled:false
    },{
      typeDiv: TYPEELEMENT.INPUTBOX,
      type: "text",
      required: true,
      label: "E-mail",
      autoComplete: "off",
      placeholder: "E-mail",
      jsonAttribute:"email",
      value: param.email,
      disabled:false
    },{
      typeDiv: TYPEELEMENT.INPUTBOX,
      type: "password",
      required: true,
      label: "Password",
      autoComplete: "off",
      placeholder: "Password",
      jsonAttribute:"password",
      value: param.password,
      disabled:false
    },{
      typeDiv: TYPEELEMENT.COMBOBOX,
      type: "text",
      required: true,
      label: "role",
      autoComplete: "off",
      placeholder: "role",
      values: [{"id":Role.USER, "value":"Usuário"}, {"id":Role.ADMIN, "value":"Administrador"}],
      jsonAttribute:"role",
      value: param.role,
      disabled:false
    }];
    return ret;
  }

  async function postFormAction(){
    setUserSelected(undefined);
    setListUsers(await handleRowGetUser());
    setLoading(false);
    clearForm();
  }


  const tableUser=useMemo(()=>{
    return(<GenericTable rest={rest} setRest={setRest} selectedRow={userSelected} setSelectedRow={setUserSelected} />);
  },[rest, userSelected, setUserSelected]);

  return (
    <>
    <Head>
      <title>User Registration</title>
    </Head>
    <Header name={dashboard.user.name} email={dashboard.user.email} id={dashboard.user.id} role={dashboard.user.role}/>

    <div className={styles.containerCenter}>
      <div className={styles.login}>
        <h1>Register</h1>
        
        <Form 
          postFormAction={postFormAction}
          state={user} 
          setState={setUser} 
          url={'/user'} 
          fields={getFieldsRegister(user)} 
          action={ACTIONFORM.POST}
        />
        {userSelected?
        <ModalDash 
              isOpen={userSelected !== undefined} 
              onRequestClose={function (): void {
                setUserSelected(undefined);
              } }
              component={<Form 
                postFormAction={postFormAction}
                state={userSelected} 
                setState={setUserSelected} 
                url={'/user'} 
                fields={getFieldsUpdate(userSelected)} 
                action={ACTIONFORM.PATCH}
              />}
        />:
        <div className={styles.containerGrid}>{tableUser}</div>}
      </div>
      
    </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx: GetServerSidePropsContext<ParsedUrlQuery, string | false | object | undefined>) => {
  const apiClient = setupAPIClient(ctx);
  const me = (await apiClient.get('/me')).data
  const users : SignUpRowDataProps[] = (await apiClient.get('/user')).data
  let send = {props:{}};
  send.props = {...send.props, dashboard: {message: {code: 200, message: ""},
      user: {id: me.id, name: me.name, email: me.email, role: me.role}},
    users: users};
  return send;
})