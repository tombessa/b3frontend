import React from 'react';
import {SelectColumnFilter, SliderColumnFilter, NumberRangeColumnFilter} from "../components/ui/Table";


export type ColumnProps = {
    Header:string;
    accessor:React.FunctionComponent<any>;
    minWidth?:Number;
    filter?:string;
    canFilter?:boolean;
    Filter?:React.FunctionComponent<any>;
    columns?:ColumnProps[];
}


export function userColumn(): ColumnProps[]{
    return [

        //10%
        {
            Header: 'Name',
            accessor: d => d.name.toString(),
            minWidth: 180,
            filter: 'fuzzyText',
        },
        //35%
        {
            Header: 'E-mail',
            accessor: d => d.email.toString(),
            minWidth: 180
        },
        //60%

        //70%
        {
            Header: 'Role',
            accessor: d => d.role.toString(),
            minWidth: 72,
            Filter: SelectColumnFilter,
            filter: 'includes',
        },
        //80%
        {
            Header: 'Try',
            accessor: d => d.try.toString(),
            minWidth: 72,
            Filter: SelectColumnFilter,
            filter: 'includes',
        },
        //90%
        {
            Header: 'Blocked?',
            accessor: d => d.blocked.toString(),
            minWidth: 72,
            Filter: SelectColumnFilter,
            filter: 'includes',
        },
        //100%
    ];
}