import {setupAPIClient} from "../services/api";
import {SignUpRowDataProps} from "./props";
import {canSSRAuth} from "./canSSRAuth";
import {GetServerSidePropsContext} from "next";
import {ParsedUrlQuery} from "querystring";


export const handleUserGet = async() => {
    const apiClient = setupAPIClient();
    const users : SignUpRowDataProps[] = (await apiClient.get('/users')).data
    return users;
}

