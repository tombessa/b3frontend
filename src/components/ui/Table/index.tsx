import MaterialTable, {Column, Options, Query, QueryResult} from 'material-table';
import {MaterialTableProps, MTableBodyRow} from 'material-table';
import { AddBox, ArrowDownward } from "@material-ui/icons";
import { ThemeProvider, createTheme } from '@mui/material';
// When using TypeScript 4.x and above
import type {} from '@mui/x-date-pickers/themeAugmentation';
import {ChangeEventHandler, Dispatch, SetStateAction} from "react";
import * as React from "react";

export type RowData = React.ReactElement<any>;

export type GenericMaterialTableProps ={
    setData: React.Dispatch<React.SetStateAction<any>>
    columns: Column<RowData>[]
    data: RowData[] | ((query: Query<RowData>) => Promise<QueryResult<RowData>>)
    handleRowDelete?(p1 : any, p2: any): Promise<void>
    handleRowUpdate?(p1? : any, p2? : any, p3? : any): Promise<void>
    handleRowAdd?(p1 : any, p2: any): Promise<void>
    title?: string | React.ReactElement<any>
    options?: Options<any>

}

export type GenericTableProps = {
    rest: GenericMaterialTableProps|undefined
    setRest: React.Dispatch<React.SetStateAction<any>>
    selectedRow: any
    setSelectedRow : React.Dispatch<React.SetStateAction<any>>
    corSelecionada?: string
    corNaoSelecionada?: string
}

export function GenericTable({rest, setRest, selectedRow, setSelectedRow, corSelecionada, corNaoSelecionada}: GenericTableProps): React.ReactElement<any,any>{
    if(!rest) return <React.Fragment></React.Fragment>;
    if(!corSelecionada){corSelecionada='#67aeae'}
    if(!corNaoSelecionada){corNaoSelecionada='#FFF'}
    if(!rest.title) rest.title=""
    const defaultMaterialTheme = createTheme();
    let customEditable={};
    if(rest.handleRowAdd){
        customEditable={...customEditable,
            onRowAdd: (newData: RowData) =>
                new Promise<void>((resolve) =>{
                    setTimeout(() => {
                        resolve();
                        setRest((prevState: GenericMaterialTableProps) => {
                            // @ts-ignore
                            const data = [...prevState.data];
                            data.push(newData);
                            return { ...prevState, data };
                        });
                    }, 600);

                    if(rest.handleRowAdd!==undefined) rest.handleRowAdd(newData, resolve);
                })
        };
    }
    if(rest.handleRowUpdate){
        customEditable={...customEditable,
            onRowUpdate: (newData: RowData, oldData?: RowData) =>
                new Promise<void>((resolve) => {
                    setTimeout(() => {
                        resolve();
                        if (oldData) {
                            setRest((prevState: GenericMaterialTableProps) => {
                                // @ts-ignore
                                const data = [...prevState.data];
                                data[data.indexOf(oldData)] = newData;
                                return { ...prevState, data };
                            });
                        }
                    }, 600);
                    if(rest.handleRowUpdate!==undefined) rest.handleRowUpdate(newData, oldData, resolve);
                })
        };
    }
    if(rest.handleRowDelete){
        customEditable={...customEditable,
            onRowDelete: (oldData?: RowData) =>
                new Promise<void>((resolve) => {
                    setTimeout(() => {
                        resolve();
                        setRest((prevState: GenericMaterialTableProps) => {
                            // @ts-ignore
                            const data = [...prevState.data];
                            data.splice(data.indexOf(oldData), 1);
                            return { ...prevState, data };
                        });
                    }, 600);

                    if(rest.handleRowDelete!==undefined)  rest.handleRowDelete(oldData, resolve);
                })
        };
    }
    return (<ThemeProvider theme={defaultMaterialTheme}>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <MaterialTable
          data={rest.data}
          columns={rest.columns}
          editable={customEditable}
          title={rest.title}
            onRowClick={(evt, item) =>{
              // @ts-ignore
              setSelectedRow(item);
            }
          }
          options={{...rest.options,
            search: true,
              filtering: true,
            rowStyle: rowData => {
              return ({
                  fontSize: 12,
                backgroundColor:
                (selectedRow ? (selectedRow.id === rowData.id ? corSelecionada : corNaoSelecionada) : corNaoSelecionada)
              });
            }
          }}
          
        />
        
      </ThemeProvider>);
}