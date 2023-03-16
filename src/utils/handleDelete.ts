import { SignUpRowDataProps } from "../pages/signup";
import {setupAPIClient} from "../services/api";


export const handleRowDeleteUser = async (oldData: SignUpRowDataProps, resolve: Promise<any>) => {
    const apiClient = setupAPIClient();
    await apiClient.patch('/user/remove', {id: oldData.id});
    (await resolve)();
}


