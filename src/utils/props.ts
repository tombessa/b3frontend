export type MessageProps = {
    code: number;
    message: String;
}

export type RoleProps = {
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
}

export type DashboardProps = {
    message:MessageProps;
    user: UserProps;
}

export type RowData = React.ReactElement<any>;


export interface SignUpRowDataProps extends UserProps, RowData {

}