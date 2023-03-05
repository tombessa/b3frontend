import {SignUpRowDataProps} from "./props";
import {setupAPIClient} from "../services/api";


export const handleRowDeleteUser = async (oldData: SignUpRowDataProps, resolve: Promise<any>) => {
    const apiClient = setupAPIClient();
    apiClient.patch('/users/remove', {id: oldData.id});
    (await resolve)();
}