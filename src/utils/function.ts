

export function getLookUpProps(key:any, param: any[]){
    let lookUpParam:any={};
    Array.isArray(param)?param.forEach(t=>{
        if(t[key])
            lookUpParam[t.id]=t[key];
    }):{};
    return lookUpParam;
}
export function getLookUpEnum(key:any, param: any[]){
    let lookUpParam:any={};
    Array.isArray(param)?param.forEach(t=>{
        if(t[key])
            lookUpParam[t[key]]=t[key];
    }):{};
    return lookUpParam;
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