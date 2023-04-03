import React from 'react'
import {ColumnProps} from "../../../utils/columns";
import {motion, AnimatePresence, MotionProps} from 'framer-motion'
import matchSorter from 'match-sorter'
// @ts-ignore
import styled from 'styled-components'
// @ts-ignore
import {useTable, useSortBy, useFilters, useColumnOrder, usePagination, useRowSelect} from 'react-table'

import styles from './styles.module.scss';


import {TbArrowBigDownLine, TbArrowBigUpLine} from "react-icons/tb";
import {MdFilterAlt} from "react-icons/md";

type DefaultColumnFilterProps = {
    column: {
        filterValue: any[],
        preFilteredRows: any[],
        setFilter: React.Dispatch<React.SetStateAction<any>>
    }
}


// Define a default UI for filtering
export function DefaultColumnFilter({column: {filterValue, preFilteredRows, setFilter}}: DefaultColumnFilterProps) {
    const count = preFilteredRows.length

    return (
        <input
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
            }}

        />
    )
}


type SelectColumnFilterProps = {
    column: {
        filterValue: any[],
        preFilteredRows: any[],
        setFilter: React.Dispatch<React.SetStateAction<any>>,
        id: string
    }
}

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({column: {filterValue, setFilter, preFilteredRows, id}}: SelectColumnFilterProps) {
    // Calculate the options for filtering
    // using the preFilteredRows

    const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })
        return [...options.values()]
    }, [id, preFilteredRows])


    // Render a multi-select box
    return (
        <select
            value={filterValue}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value="">All</option>
            {options.map((option: any, i: number) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </select>
    )
}

type SliderColumnFilterProps = {
    column: {
        filterValue: any[],
        preFilteredRows: any[],
        setFilter: React.Dispatch<React.SetStateAction<any>>,
        id: string
    }
}

// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
export function SliderColumnFilter({column: {filterValue, setFilter, preFilteredRows, id},}: SliderColumnFilterProps) {
    // Calculate the min and max
    // using the preFilteredRows

    const [min, max] = React.useMemo(() => {
        let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        preFilteredRows.forEach(row => {
            min = Math.min(row.values[id], min)
            max = Math.max(row.values[id], max)
        })
        return [min, max]
    }, [id, preFilteredRows])

    return (
        <>
            <input
                type="range"
                min={min}
                max={max}
                value={filterValue || min}
                onChange={e => {
                    setFilter(parseInt(e.target.value, 10))
                }}
            />
        </>
    )
}

type NumberRangeColumnFilterProps = {
    column: {
        filterValue: any[],
        preFilteredRows: any[],
        setFilter: React.Dispatch<React.SetStateAction<any>>,
        id: string
    }
}

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
export function NumberRangeColumnFilter({
                                            column: {
                                                filterValue = [],
                                                preFilteredRows,
                                                setFilter,
                                                id
                                            },
                                        }: NumberRangeColumnFilterProps) {
    const [min, max] = React.useMemo(() => {
        let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        preFilteredRows.forEach(row => {
            min = Math.min(row.values[id], min)
            max = Math.max(row.values[id], max)
        })
        return [min, max]
    }, [id, preFilteredRows])

    return (
        <div
            style={{
                display: 'flex',
            }}
        >
            <input
                value={filterValue[0] || ''}
                min={min}
                max={max}
                type="number"
                onChange={e => {
                    const val = e.target.value
                    setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
                }}
                placeholder={`Min (${min})`}
                style={{
                    width: '70px',
                    marginRight: '0.5rem',
                }}
            />
            to
            <input
                value={filterValue[1] || ''}
                type="number"
                min={min}
                max={max}
                onChange={e => {
                    const val = e.target.value
                    setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
                }}
                placeholder={`Max (${max})`}
                style={{
                    width: '70px',
                    marginLeft: '0.5rem',
                }}
            />
        </div>
    )
}

export function fuzzyTextFilterFn(rows: any, id: string | number, filterValue: any) {
    // @ts-ignore
    return matchSorter(rows, filterValue, {keys: [row => row.values[id]]})
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val: any): boolean => !val

export function shuffle(arr: any[]) {
    arr = [...arr]
    const shuffled = []
    while (arr.length) {
        const rand = Math.floor(Math.random() * arr.length)
        shuffled.push(arr.splice(rand, 1)[0])
    }
    return shuffled
}


export type GenericTableProps = {
    columns: ColumnProps[];
    data: any[];
    rowSelected?: any;
    setRowSelected?: React.Dispatch<React.SetStateAction<any>>;
}

export function GenericTable({
                                 columns,
                                 data,
                                 rowSelected,
                                 setRowSelected
                             }: GenericTableProps): React.ReactElement<any, any> {
    const defaultColumn = React.useMemo(
            () => ({
                // Let's set up our default Filter UI
                Filter: DefaultColumnFilter,
            }),
            []
        ), {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            page,
            visibleColumns,
            prepareRow,
            setColumnOrder,
            canPreviousPage,
            canNextPage,
            pageOptions,
            pageCount,
            gotoPage,
            nextPage,
            previousPage,
            setPageSize,
            state: { pageIndex, pageSize },
        } = useTable(
            {
                columns,
                data,
                defaultColumn,
                initialState: { pageIndex: 0 },
            },
            useColumnOrder,
            useFilters,
            useSortBy,
            usePagination,
            useRowSelect),
        spring = React.useMemo(
            () => {
                return ({
                    type: 'spring',
                    damping: 50,
                    stiffness: 100,
                });
            },
            []
        ), randomizeColumns = (p: {}) => {
            setColumnOrder(shuffle(visibleColumns.map((d: { id: any; }) => {
                return d.id;
            })))
        };


    return (
        <>
            <table className={styles.table} {...getTableProps()}>
                <thead className={styles.thead}>
                {headerGroups.map((headerGroup: {
                    getHeaderGroupProps: () => JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>;
                    headers: any[];
                }, i: any) => (
                    <tr className={styles.tr} {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => {
                            return (
                                <motion.th
                                    {...column.getHeaderProps({
                                        layoutTransition: spring,
                                        style: {
                                            minWidth: column.minWidth,
                                        },
                                    })}
                                >
                                    <div {...column.getSortByToggleProps()}>
                                        {column.render('Header')}
                                        <span>
                                          {column.isSorted
                                              ? column.isSortedDesc
                                                  ? <TbArrowBigDownLine/>
                                                  : <TbArrowBigUpLine/>
                                              : ''}
                                        </span>
                                    </div>
                                    <div className={styles.filter}>{column.canFilter ? column.render('Filter') : null}
                                        <MdFilterAlt size={25}/></div>
                                </motion.th>

                            );
                        })}
                    </tr>
                ))}
                </thead>
                <tbody className={styles.tbody} {...getTableBodyProps()}>
                <AnimatePresence>
                    {page.slice(0, 10).map((row: any, i: any) => {
                        prepareRow(row);

                        return (
                            <motion.tr onClick={(e => {
                                if (setRowSelected) {
                                    setRowSelected(row.original)
                                }
                            })}

                                       {...row.getRowProps({
                                           layoutTransition: spring,
                                           exit: {opacity: 0, maxHeight: 0},
                                       })}
                                       className={rowSelected ? rowSelected.id === row.original.id ? styles.rowSelected : styles.tbody : styles.tbody}
                            >
                                {row.cells.map((cell: any, i: any) => {
                                    return (
                                        <motion.td
                                            {...cell.getCellProps({
                                                layoutTransition: spring,
                                            })}
                                        >
                                            {cell.render('Cell')}
                                        </motion.td>
                                    )
                                })}
                            </motion.tr>
                        )
                    })}
                </AnimatePresence>
                </tbody>
            </table>
            <div className={styles.pagination}>
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>
                {' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>
                {' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>
                {' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>
                {' '}
                <span>Page{' '}<strong>{pageIndex + 1} of {pageOptions.length}</strong>{' '}</span>
                <span>| Go to page:{' '}
                    <input
                        type="number"
                        min={1}
                        max={pageCount}
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                        style={{width: '100px'}}
                    />
                </span>{' '}
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 25, 50, 100].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </>
    )
}