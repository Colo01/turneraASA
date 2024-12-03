import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointments } from "../features/appointment";

const Calendar = () => {
  const dispatch = useDispatch();
  const [selectedOffice, setSelectedOffice] = useState(null);
  const appointments = useSelector((state) => state.appointment);

  useEffect(() => {
    if (selectedOffice) {
      dispatch(fetchAppointments(selectedOffice._id));
    }
  }, [dispatch, selectedOffice]);

  return (
    <div>
      <h2>Calendario de Turnos</h2>
      {appointments.length > 0 ? (
        appointments.map((appt) => (
          <div key={appt._id}>
            <p>Fecha: {appt.date}</p>
            <p>Hora: {appt.time}</p>
            <p>Estado: {appt.state}</p>
          </div>
        ))
      ) : (
        <p>No hay turnos disponibles.</p>
      )}
    </div>
  );
};

export default Calendar;
