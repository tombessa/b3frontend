import { UserProps } from "../pages/signup";

export type MessageProps = {
    code: number;
    message: String;
}

export type DashboardProps = {
    message:MessageProps;
    user: UserProps;
}

export type RowData = React.ReactElement<any>;


