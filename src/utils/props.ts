import {UserProps} from "../contexts/AuthContext";

export type MessageProps = {
    code: number;
    message: String;
}

export type DashboardProps = {
    message:MessageProps;
    user: UserProps;
}