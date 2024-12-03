import { createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import axios from 'axios';

// Obtener sucursales del backend
export const fetchBranchOffices = createAsyncThunk("FETCH_BRANCH_OFFICES", async (_, thunkAPI) => {
  try {
    const token = JSON.parse(localStorage.getItem("user")).data.token;
    const response = await axios.get("http://localhost:5000/api/deliveryPoint", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});


// Reiniciar el estado de sucursales
export const emptyBranchOffice = createAsyncThunk("EMPTY_BRANCH_OFFICE", () => {
  return {}; // Devuelve un objeto vacío como estado inicial
});

const branchOfficeReducer = createReducer({}, {
  [fetchBranchOffices.fulfilled]: (state, action) => action.payload, // Almacena las sucursales
  [emptyBranchOffice.fulfilled]: () => ({}), // Reinicia el estado de sucursales
});

export default branchOfficeReducer;
