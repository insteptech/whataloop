import { createAsyncThunk } from "@reduxjs/toolkit";

import api from "@/axios/axiosInterceptor";

export const postLeads = createAsyncThunk("postLeads", async (payload: any) => {
    try{
        const response = await api.post("/lead", payload);
        console.log("kk", response, response.status);
        return response;
    } catch(error){
        return error.response.data
    }
})