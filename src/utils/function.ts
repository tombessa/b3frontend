import {api, apiSocial} from "../services/apiClient";
import {destroyCookie, setCookie} from "nookies";
import {toast} from "react-toastify";
import Router from "next/router";
import {useState} from "react";
import {Role} from "./role";


export function getLookUpProps(key:any, param: any[]){
    let lookUpParam:any={};
    if(key){
        lookUpParam = Array.isArray(param)?param.filter(t => t.id === key):{};
        return lookUpParam[0];
    }else return "";

}

export function getLookUpEnum(key:any, param: any[]){
    let lookUpParam:any={};
    lookUpParam = Array.isArray(param)?param.filter(t => t.id === key):{};
    return lookUpParam[0];
}


export function getArrayCombo(key:string, param:any[]){
    let ret : any[] = [{id:"", value:""}];

    if(Array.isArray(param)){
      param.forEach(t=>ret.push({id:t.id, value:t[key]}))
    }

    return ret;
}

export function returnDefaultEnum(enums:any[]){
    let retEnum : any = {};
    if(enums!==undefined)
        enums.forEach(t=>{
            let enumDefault:any = t[0];
        retEnum[enumDefault.field]  =enumDefault.value;
        });
    return retEnum;	  
}
