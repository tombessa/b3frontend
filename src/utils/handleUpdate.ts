import {SignUpRowDataProps} from "./props";
import {setupAPIClient} from "../services/api";


export const handleRowUpdateUser = async (newData: SignUpRowDataProps, oldData: SignUpRowDataProps, resolve: Promise<any>) => {
    const apiClient = setupAPIClient();
    await apiClient.patch('/users', newData);
    (await resolve)();
}