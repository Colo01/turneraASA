// client/src/features/user.js

import { createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import axios from 'axios';

export const userRegister = createAsyncThunk("USER_REGISTER", (data) => {
    console.log(data)
    return axios.post("http://localhost:5000/api/user/register", data) // chequear ruta
        .then(user => {
            localStorage.setItem('registered', JSON.stringify(user.data))
            return user.data
        })
        .catch(err => console.log(err))
});

export const userLogin = createAsyncThunk("USER_LOGIN", (data) => {
    console.log(data)
    return axios.post("http://localhost:5000/api/user/login", data)
        .then(user => {
            localStorage.setItem('user', JSON.stringify(user.data))
            return user.data
        });
});

export const userLogout = createAsyncThunk("USER_LOGOUT", () => {
    return axios.post("http://localhost:5000/api/user/logout")
        .then(() => {
            localStorage.removeItem('user')
            return { }
        })
});

const userReducer = createReducer({}, {
    [userRegister.fulfilled]: (state, action) => action.payload,
    [userLogin.fulfilled]: (state, action) => action.payload,
    [userLogout.fulfilled]: (state, action) => action.payload,
});

export default userReducer;