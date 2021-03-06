import React from 'react'
import axios from 'axios'

import {MdEdit} from 'react-icons/md';
//import myheader from '../../myheader'
import ctUtil from '../../util/ctUtil'
import axiosUtil from '../../util/axiosUtil'
import ModalForm from '../../render/renderForm/ModalForm'
import {MainContext} from '../../context/MainContext';
import StateTemplate from '../../model/StateTemplate'
import FormTemplate from '../../render/renderForm/FormTemplate'
import renderTableRangeBar from '../../component/table/renderTableRangeBar'
import Badge from '../../render/renderBadge/Badge'
import renderModalError from '../../render/renderModalError'
import Table from '../../component/table/Table'
import ModalConfirm from '../../render/ModalConfirm'

const {createTableTemplateForPage,convertTableTemplateObjToArray}=ctUtil
const {genArrayForFilterAxios,genFD,addFileNameInPhotoUrl}=axiosUtil
const {basicDataState}=StateTemplate
const {basicDataForm,routeAuthForm}=FormTemplate 

const BasicData = () => {

const {basicData,setReloadBasicData,myheader,
      widthLeft,setWidthLeft
}=React.useContext(MainContext)

//====================================
const [isSecond,setIsSecond]=React.useState(false)
React.useEffect(()=>{
    if(!isSecond){
        setIsSecond(true)
        setReloadBasicData(true)
    }
},[isSecond])  
//=======================================

//=================================================
const refreshPage=()=>{

}
const submitFunctionEdit=(formInputState)=>{

    const temp={...basicData,...formInputState}
    axios.post(`/basicdata/updatecustom`,temp,myheader)
        .then(result=>{
            setShowEdit(false)
            setReloadBasicData(true)
        })
        .catch(error=>{
            setMessage(error.response.data.message)
            setShowModalError(true)
        })
}

const saveRouteAuthTableTemplateAxios=()=>{
    console.log('saveRouteAuthTableTemplateAxios')

    let tempTableTemplate={}
    const object=Object.keys(routeAuthTableTemplate)
    object.map(i=>{
        let tempObj=routeAuthTableTemplate[i]
        tempTableTemplate={
            ...tempTableTemplate,
            [i]:{...tempObj,["showColHead"]:true}}
    })

    const temp={
        tableName:"basicDataTableTemplate",
        template: convertTableTemplateObjToArray(tempTableTemplate)
    }

    //console.log('temp')
    //console.log(temp)
    axios.post(`/tabletemplate/updatetabletemplate`,temp,myheader)

}

const submitFunctionEditRouteAuth=(formInputState)=>{

    setEditRouteAuthData(formInputState)
    let temp=[]

    basicData.routeAuth.map(i=>{
        let tempObj=i
        if(i.id==formInputState.id){
            console.log("match")
            tempObj={...tempObj,...formInputState}
        }
        temp=[...temp,tempObj]
    })
    const  updateBasicData={...basicData,["routeAuth"]:temp}
 
    axios.post(`/basicdata/updatecustom`,updateBasicData,myheader)
    .then(result=>{
        setShowEditRouteAuth(false)
        setReloadBasicData(true)
    })
    .catch(error=>{
        setMessage(error.response.data.message)
        setShowModalError(true)
    })
}

const submitFunctionAddRouteAuth=(formInputState)=>{
    const  updateBasicData={...basicData,
        ["routeAuth"]:[...basicData.routeAuth,formInputState]
    }
    //console.log(updateBasicData)
    axios.post(`/basicdata/updatecustom`,updateBasicData,myheader)
    .then(result=>{
        setShowAddRouteAuth(false)
        setReloadBasicData(true)
    })
    .catch(error=>{
        setMessage(error.response.data.message)
        setShowModalError(true)
    })
    
}

const submitDeleteFunction = ()=>{
    console.log('submitDeleteFunction')
    console.log(editRouteAuthData)
    
    let temp=[]

    basicData.routeAuth.map(i=>{
        let tempObj=i
        if(i.id!==editRouteAuthData.id){
            temp=[...temp,tempObj]
        }
    })
    const  updateBasicData={...basicData,["routeAuth"]:temp}
    
    axios.post(`/basicdata/updatecustom`,updateBasicData,myheader)
    .then(result=>{
        setShowModalConfirm(false)
        setReloadBasicData(true)
    })
    .catch(error=>{
        setMessage(error.response.data.message)
        setShowModalError(true)
    })
    
}
//====================================

const [reloadRouteAuthTableTemplate,setReloadRouteAuthTableTemplate] = React.useState(true);
const [routeAuthTableTemplate,setRouteAuthTableTemplate] = React.useState(null)

const [showRange,setShowRange]=React.useState(false)

const [badgeState,setBadgetState]=React.useState({
    swapShow:false,swapFunc:()=>{},
    reloadShow:true,reloadFunc:()=>{},
    filterShow:false,filterFunc:()=>{},
    addShow:true,addFunc:()=>{},
    editShow:false,editFunc:()=>{},
    delShow:false,delFunc:()=>{},
    printerShow:true,printerFunc:()=>{}
  })

const [showEdit,setShowEdit]=React.useState(false) //editIcon
const [showEditRouteAuth,setShowEditRouteAuth]=React.useState(false) //editIcon

const [showAddRouteAuth,setShowAddRouteAuth]=React.useState(false) //editIcon

const [showModalConfirm,setShowModalConfirm]=React.useState(false) //delIcon
const [showModalError,setShowModalError]=React.useState(false)

const [editRouteAuthData,setEditRouteAuthData]=React.useState(null)
const [message,setMessage]=React.useState(null)

//=====================================
React.useEffect(()=>{

    if(reloadRouteAuthTableTemplate){
        /*
        if(localStorage.getItem('shopauthorization')&&
           localStorage.getItem('userauthorization')
           //to ensure user&shop token in place before request to server
        ){*/
            axios.post('/tabletemplate/getcustom',
            {},myheader
            /*
            {headers: {'Content-Type': 'application/json',
                'Shopauthorization':localStorage.getItem('shopauthorization'),
                'Userauthorization':localStorage.getItem('userauthorization')
            }}*/
            )
            .then(result=>{
                console.log('temp reload')
                //console.log(result)
                const temp=createTableTemplateForPage(result.data.data)
                
                setRouteAuthTableTemplate(temp["basicDataTableTemplate"])
                setReloadRouteAuthTableTemplate(false)
                //console.log(result.data.data[0])
            })
            .catch(error=>{
                setMessage(error.response.data.message)
                setReloadRouteAuthTableTemplate(false)
            })
        //}
    }
},[reloadRouteAuthTableTemplate])


React.useEffect(()=>{
    if(isSecond){
        if(editRouteAuthData){
            if(editRouteAuthData.id){
                setBadgetState({
                    ...badgeState,
                    delShow:true,
                    editShow:true,
                })
            }
            else{
                setBadgetState({
                    ...badgeState,
                    delShow:false,
                    editShow:false,
                })
            }
        }
    }
},[editRouteAuthData])


//=========================================
const renderSelect=()=>{
    
    const arrs=[
        {lb:"title",name:"title",
            cName:"xc12 sc12 p-1 flex-center-baseline",
            subCName:["xc4 sc12 ","xc8 sc12 "]},

        {lb:"unit",name:"unit",
            cName:"xc12 sc12 p-1 flex-center-baseline",
            subCName:["xc4 sc12 ","xc8 sc12"]},
        
        {lb:"user level",name:"userLevel",
            cName:"xc12 sc12 p-1 flex-center-baseline",
            subCName:["xc4 sc12 ","xc8 sc12"]},            

        
    ]

    return(
    <div className="w-100 h-90" style={{overflow:"auto"}}>   
    {arrs.map((a,index)=>{
        
        return(
        <div key={index} className={a.cName}>
            <div className={a.subCName[0]}>
                <label >{a.lb}</label>  
            </div>             
            <div className={a.subCName[1]}>
                <select className="w-100">  
                    <option value="" hidden>
                        select from list...</option>
                    {basicData 
                    ?basicData[`${a.name}`].map((m,index)=>
                        <option key={index}>{m}</option>)
                    :null
                    }
                </select>
            </div>    
        </div>)
    })}
    </div>      
    ) 
    
}

const renderTable=()=>{


    if(!routeAuthTableTemplate||!basicData){return null}
    console.log('pass1')
    if(!basicData.routeAuth){return null}

    return(
    <div className="w-100 h-100">
        <div className="h-5 flex-center-center">
            <h3>User Authorization</h3>
        </div>
        <div className="h-95">
            <Table
                colorHead={"#EFC050"}
                tableTemplate={routeAuthTableTemplate}
                setTableTemplate={setRouteAuthTableTemplate}
                filterData={basicData.routeAuth}
                editData={editRouteAuthData}
                setEditData={setEditRouteAuthData}
                saveTableTemplateFunc={saveRouteAuthTableTemplateAxios}
                isSubTable={true}
            />
        </div>
    </div>
    )
}
//=========================================
//=========================================
    return (
    <div style={{height:"100%",width:"100%",position:'relative'}}>
        {renderTableRangeBar({showRange,setShowRange,widthLeft,setWidthLeft})}
        
        <div className="flex-center-center"
             style={{height:"95%"}}
        >
            <div className="bd-darkGray" 
                style={{height:"100%",width:`${widthLeft}%`}}>
                <div className="flex-center-baseline  mt-1">
                        <h3>Setting Value</h3>
                        <MdEdit className="md-icon"
                                onClick={e=>setShowEdit(true)}
                        />
                    
                </div>
            {
                renderSelect()
            }
            </div>
            <div className="bd-darkGray" 
                style={{height:"100%",width:`${100-widthLeft}%`}}>
            {
                renderTable()
            }
            </div>
        </div>

        {
        <div className="flex-center-center w-100 h-5">
            <Badge
            //delIcon
                badgeState={badgeState}
                totalSwapPage={1}
                
                setReloadData={setReloadBasicData} //reloadIcon
                setShowAdd={setShowAddRouteAuth}
                setShowEdit={setShowEditRouteAuth} //editIcon
                setShowModalConfirm={setShowModalConfirm} 
            />
        </div>
        }    

        {showEdit
        ?<ModalForm
            lb={"Edit Form"}
            formTemplate={basicDataForm}
            stateTemplate={basicDataState}
            loadData={basicData}
            setShow={setShowEdit}
            submitFunction={submitFunctionEdit}
        />
        :null
        }

        {showEditRouteAuth
        ?<ModalForm
            lb={"Edit User Authorization"}
            formTemplate={routeAuthForm}
            stateTemplate={basicDataState.routeAuth.stChildren}
            loadData={editRouteAuthData}
            setShow={setShowEditRouteAuth}
            submitFunction={submitFunctionEditRouteAuth}
            selectData={{basicData:basicData}}

        />
        :null
        }

        {showAddRouteAuth
        ?<ModalForm
            lb="Add User Authorization"
            formTemplate={routeAuthForm}
            stateTemplate={basicDataState.routeAuth.stChildren}
            loadData={null}
            setShow={setShowAddRouteAuth}
            submitFunction={submitFunctionAddRouteAuth}
            selectData={{basicData:basicData}}
        />
        :null
        }

        {
        showModalConfirm
        ?<ModalConfirm
            setShow={setShowModalConfirm}
            submitFunction={submitDeleteFunction}
        />
        :null
        }

        { 
        showModalError
        ?renderModalError({
            show:showModalError,
            setShow:setShowModalError,
            message,setMessage
        })
        :null
        }

    </div>
    )
}

export default BasicData
