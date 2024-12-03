import { createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import axios from 'axios';

// Obtener turnos disponibles
export const fetchAppointments = createAsyncThunk("FETCH_APPOINTMENTS", async (deliveryPointId, thunkAPI) => {
  try {
    const token = JSON.parse(localStorage.getItem("user")).data.token; // Obtener el token
    const response = await axios.get(`http://localhost:5000/api/availableAppointments?deliveryPointId=${deliveryPointId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Retornar los turnos disponibles
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Reiniciar el estado de turnos
export const emptyAppointment = createAsyncThunk("EMPTY_APPOINTMENT", () => {
  return []; // Devuelve un arreglo vacío como estado inicial
});

const appointmentReducer = createReducer([], {
  [fetchAppointments.fulfilled]: (state, action) => action.payload.data, // Almacena los turnos
  [emptyAppointment.fulfilled]: () => [], // Reinicia el estado de turnos
});

export default appointmentReducer;
