// client/src/views/CalendarOperator.jsx

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import style from "../styles/Users.module.css";

const CalendarOperator = () => {
  const pickedBranchOffice = useSelector(
    (state) => state.branchOffice.clickedOffice
  );
  const [availableAppointments, setAvailableAppointments] = useState([]);

  const loadAppointments = () => {
    axios
      .get(`http://localhost:5000/api/availableAppointment?deliveryPointId=${pickedBranchOffice._id}`)
      .then((response) => {
        setAvailableAppointments(response.data.data);
      })
      .catch((err) =>
        console.error("Error al obtener turnos disponibles:", err)
      );
  };

  useEffect(() => {
    if (pickedBranchOffice?._id) {
      loadAppointments();
    }
  }, [pickedBranchOffice]);

  return (
    <div className={style.mainContainer}>
      <h3>Turnos disponibles para {pickedBranchOffice?.name}</h3>
      {availableAppointments.length > 0 ? (
        <ul className={style.appointmentList}>
          {availableAppointments.map((appointment, index) => (
            <li key={index} className={style.appointmentItem}>
              <div>
                <strong>Fecha:</strong> {appointment.date} <br />
                <strong>Hora:</strong> {appointment.time} <br />
                <strong>Disponibilidad:</strong>{" "}
                {appointment.availableSlots > 0
                  ? `${appointment.availableSlots} lugares disponibles`
                  : "No disponible"}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay turnos disponibles en este momento.</p>
      )}
    </div>
  );
};

export default CalendarOperator;
