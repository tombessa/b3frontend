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
import {SignUpProps, SignUpRowDataProps} from "../../utils/props";
import {Header} from "../../components/Header";
import { ComboBox, OptionCombo } from "../../components/ui/ComboBox";
import {GenericMaterialTableProps, GenericTable} from "../../components/ui/Table";
import {userColumn} from "../../utils/columns";
import {handleRowUpdateUser} from "../../utils/handleUpdate";
import {handleUserGet} from "../../utils/handleGet";
import {handleRowDeleteUser} from "../../utils/handleDelete";

export default function SignUp({dashboard, users}: SignUpProps) {
  const {signUp} = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('USER');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userItem, setUserItem] = useState<SignUpRowDataProps>();
  const [userSelected, setUserSelected] = useState<SignUpRowDataProps>();
  const [rest, setRest] = useState<GenericMaterialTableProps>();
  const[listUsers, setListUsers] = useState<SignUpRowDataProps[]>([]);

  function clearForm(){
    setName('');
    setEmail('');
    setRole('USER');
    setPassword('');
  }

  async function handleSignUp(event: FormEvent){
    event.preventDefault();
    if(name==='' || email ==='' || password==='') {
      toast.error("Required Fields.");
      return;
    }
    setLoading(true);
    let data = {
      name: name,
      email: email,
      password: password,
      role: role
    }
    await signUp(data);
    let newUsers = await handleUserGet();
    console.log(newUsers);
    setListUsers(newUsers);
    setLoading(false);
    clearForm();
  }

  useMemo(async () => {
    setListUsers(users);
  },[]);

  useMemo(()=>{
    setRest({
      columns: userColumn(),
      data: listUsers,
      handleRowDelete: handleRowDeleteUser,
      handleRowUpdate: handleRowUpdateUser,
      setData: setUserItem,
      options: {
        pageSize: 10
      }
    });
  },[listUsers]);

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
          <ComboBox
              value={role}
              onChange={ (e) => setRole(e.target.value) }
          >
            <option>USER</option>
            <option>ADMIN</option>
          </ComboBox>

          <Button
            type="submit"
            loading={loading}
          >
            Register
          </Button>
        </form>


      </div>
      <div className={styles.containerGrid}>{tableUser}</div>
    </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx: GetServerSidePropsContext<ParsedUrlQuery, string | false | object | undefined>) => {
  const apiClient = setupAPIClient(ctx);
  const me = (await apiClient.get('/me')).data
  const users : SignUpRowDataProps[] = (await apiClient.get('/users')).data
  let send = {props:{}};
  send.props = {...send.props, dashboard: {message: {code: 200, message: ""},
      user: {id: me.id, name: me.name, email: me.email, role: me.role}},
    users: users};
  return send;
})