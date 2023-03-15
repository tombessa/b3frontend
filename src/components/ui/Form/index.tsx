import { setupAPIClient } from '../../../services/api';
import styles from './styles.module.scss';
import { toast } from "react-toastify";
import {FieldValues, useForm, UseFormRegister} from "react-hook-form";
import { Button } from '../Button';
import { Input } from '../Input';
import {useEffect} from "react";
import {useRouter} from "next/router";

import { ChangeEventHandler, useCallback } from 'react';
import * as React from "react";
import {ComboBox, CompleteComboBox} from "../ComboBox";

export function useConfirmRedirectIfDirty(isDirty: boolean) {
    const router = useRouter()

    // prompt the user if they try and leave with unsaved changes
    useEffect(() => {
        const warningText = 'You have unsaved changes - are you sure you wish to leave this page?';
        const handleWindowClose = (e: BeforeUnloadEvent) => {
            if (!isDirty) return;
            e.preventDefault();
            return (e.returnValue = warningText);
        };
        const handleBrowseAway = () => {
            if (!isDirty) return;
            if (window.confirm(warningText)) return;
            router.events.emit('routeChangeError');
            throw 'routeChange aborted.';
        };
        window.addEventListener('beforeunload', handleWindowClose);
        router.events.on('routeChangeStart', handleBrowseAway);
        return () => {
            window.removeEventListener('beforeunload', handleWindowClose);
            router.events.off('routeChangeStart', handleBrowseAway);
        };
    }, [isDirty]);
}

type Props = {
    state:React.SetStateAction<any>
    setState:React.Dispatch<React.SetStateAction<any>>
    // Where to GET/POST the form data
    url: string
    fields: Array<ItemFormProps>
    actionNameButton?: string
    postFormAction: () => void;
    action: ACTIONFORM;
}

export enum ACTIONFORM{
    POST,
    PATCH
}

export enum TYPEELEMENT {
    INPUTBOX,
    COMBOBOX,
    CHECKBOX
}

export type ItemFormProps = {
    typeDiv: TYPEELEMENT
    type: string 
    required: boolean
    label: string
    autoComplete: string
    placeholder: string
    jsonAttribute: string
    value: any
    values? : Array<any>,
    disabled : boolean
}

export type SelectFormProps = {
    name?: string
    value: any
    setValue?: React.Dispatch<React.SetStateAction<any>>
    values?: Array<any>
    handleChange?: ChangeEventHandler<HTMLSelectElement>
}


// All values that come from useForm, to be used in our custom forms
export type FormProps = {
    fields: Array<ItemFormProps>
    register: UseFormRegister<FieldValues>
    isSubmitting: boolean
    errors: { [error: string]: any }
    actionNameButton?: string
}

async function saveFormData(data: object, url: string, action: ACTIONFORM) {
    
    try{
        const apiClient = setupAPIClient();
        if(action===ACTIONFORM.POST) await apiClient.post(url, data);
        if(action===ACTIONFORM.PATCH) await apiClient.patch(url, data);
        toast.success("Registration made successfully!");
    }catch(err){
        console.log(err);
        toast.error("Erro durante o envio dos dados")
    }
}



export const Form = ({state, setState, url, fields, actionNameButton, postFormAction, action}: Props) => {
    const {register, reset, handleSubmit, setError, formState: {isSubmitting, errors, isDirty}} = useForm();
    
    function handleChange(e: any) {
      if(e)
        if(e.target)
            if (e.target.files) {
                setState({ ...state, [e.target.name]: e.target.files[0] });
            } else {
                setState({ ...state, [e.target.name]: e.target.value });
            }
    }

    function handleChangeCombo(key: string, e:any){        
        (e&&key? setState({ ...state, [key]: e.id }) :"");        
    }
  
    async function onSubmit(e:any) {      
      await saveFormData(state, url, action);
      postFormAction();
    }

  
    return (
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <>{fields.map((item, index)=> {
            if(item.typeDiv===TYPEELEMENT.INPUTBOX){
                return <Input
                    name={item.jsonAttribute}
                    placeholder={item.placeholder}
                    type={item.type}
                    value={item.value}
                    onChange={handleChange}
                    disabled={item.disabled}
                />
            }
            if(item.typeDiv===TYPEELEMENT.CHECKBOX){
                return null;
            }
            if(item.typeDiv===TYPEELEMENT.COMBOBOX){
                return <CompleteComboBox
                name={item.jsonAttribute}
                value={item.value}
                setValue={((e)=>{return handleChangeCombo(item.jsonAttribute, e);})}
                values={fields?fields.filter(t=>t.label===item.label).length>0?(fields.filter(t=>t.label===item.label)[0]).values:undefined:undefined}
                 />
            }
        })}</>
        <Button type="submit" loading={isSubmitting}>{actionNameButton?actionNameButton:"Register"}</Button>
      </form>
    );
  }