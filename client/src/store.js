import {configureStore,createSlice} from '@reduxjs/toolkit'
const auth=createSlice({name:'auth',initialState:{user:null,token:null,role:null},reducers:{setAuth:(s,{payload})=>({...s,...payload}),logout:()=>({user:null,token:null,role:null})}});export const {setAuth,logout}=auth.actions;export default configureStore({reducer:{auth:auth.reducer}})
