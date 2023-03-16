import {Column} from "material-table";
import {RowData} from "../components/ui/Table";


const never:
    | "always"
    | "onUpdate"
    | "onAdd"
    | "never" = "never";

export function userColumn(): Column<RowData>[]{
    return [
        {
            title: 'Id',
            field: 'id',
            cellStyle: { width: "10%" },
            width: "10%",
            headerStyle: { width: "10%" },
            editable: never
        },
        //10%
        {
            title: 'Name',
            field: 'name',
            cellStyle: { width: "25%" },
            width: "25%",
            headerStyle: { width: "25%" }
        },
        //35%
        {
            title: 'E-mail',
            field: 'email',
            cellStyle: { width: "25%" },
            width: "25%",
            headerStyle: { width: "25%" },
            editable: never
        },
        //60%
        {
            title: 'Password',
            field: 'password',
            cellStyle: { width: "10%" },
            width: "10%",
            headerStyle: { width: "10%" }
        },
        //70%
        {
            title: 'Role',
            field: 'role',
            cellStyle: { width: "10%" },
            width: "10%",
            headerStyle: { width: "10%" }
        },
        //80%
        {
            title: 'Try',
            field: 'try',
            cellStyle: { width: "10%" },
            width: "10%",
            headerStyle: { width: "10%" }
        },
        //90%
        {
            title: 'Blocked?',
            field: 'blocked',
            type: 'boolean',
            cellStyle: { width: "10%" },
            width: "10%",
            headerStyle: { width: "10%" }
        },
        //100%
    ];
}