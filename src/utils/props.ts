import { UserProps } from "../pages/signup";

export type MessageProps = {
    code: number;
    message: String;
}

export type DashboardProps = {
    message:MessageProps;
    user: UserProps;
}

export type HomeProps = {
    message?:any;
    user?: UserProps;
    socialLogin?: boolean;
    useSocialLogin?:boolean;
    useGitHubLogin?:boolean;
    useFacebookLogin?:boolean;
    useInstagramLogin?:boolean;
}

export type RowData = React.ReactElement<any>;


