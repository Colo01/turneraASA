// client/src/features/user.js

import { createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import axios from 'axios';

export const userRegister = createAsyncThunk("USER_REGISTER", async (data) => {
    console.log("Intentando enviar datos al backend:", data); // Log datos enviados
    try {
      const response = await axios.post("http://localhost:5000/api/user/register", data);
      console.log("Respuesta del servidor:", response.data); // Log respuesta exitosa
      return response.data;
    } catch (error) {
      console.error("Error al intentar registrar:", error.response?.data || error.message); // Log del error
      throw error; // Propaga el error para que Formik o Redux lo manejen
    }
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