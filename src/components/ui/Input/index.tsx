
import React, {InputHTMLAttributes, TextareaHTMLAttributes, useState} from 'react';
import styles from './styles.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>{}



export function Input({...rest}: InputProps){
  return(
      <input className={styles.input} {...rest} />
  )
}

export function CheckBox({...rest}: InputProps){
      if(rest.value)
        return (<input className={styles.checkbox} {...rest} checked />)
      else
        return (<input className={styles.checkbox} {...rest} />)
}



export function TextArea({...rest}: TextAreaProps){
  return(
    <textarea className={styles.input} {...rest}></textarea>
  )
}