import {useMemo, useState} from 'react';
import { SelectHTMLAttributes, OptionHTMLAttributes,  useEffect } from 'react';
import { SelectFormProps } from '../Form';
import styles from './styles.module.scss';


interface ComboBoxProps extends SelectHTMLAttributes<HTMLSelectElement>{}
interface OptionProps extends OptionHTMLAttributes<HTMLOptionElement>{}

export function OptionCombo({...rest}: OptionProps){
  return(<option {...rest} />)
}

export function ComboBox({...rest}: ComboBoxProps){
  return(    
    <select className={styles.select} {...rest} />
  )
}


export function CompleteComboBox({name, value, setValue, values}: SelectFormProps){

  return ((<ComboBox name={name}
                     value={value}
                     onChange={((event)=>{
                       if (setValue) {
                         setValue(values ? values.filter(t => t.id === event.target.value)[0] : undefined)
                       }})}
  >
    
    {Array.isArray(values)?values.map((item, index)=> {
        return(
        <OptionCombo key={index} value={item.id}>
            {item.value}
        </OptionCombo>
        ) 
    }):""}
  </ComboBox>));
}