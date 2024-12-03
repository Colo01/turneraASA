import React, { useState, useEffect } from "react";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import CustomNavbar from "../commons/CustomNavbar";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const loadAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/appointment/myAppointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(
        response.data.data.map((appointment) => ({
          id: appointment._id,
          date: appointment.date,
          time: appointment.time,
          state: appointment.state,
          location: appointment.branchOffice?.location || "Sin ubicación",
        }))
      );
    } catch (error) {
      console.error("Error al cargar turnos:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const columns = [
    { dataField: "id", text: "ID", sort: true },
    { dataField: "date", text: "Fecha" },
    { dataField: "time", text: "Hora" },
    { dataField: "state", text: "Estado" },
    { dataField: "location", text: "Ubicación" },
  ];

  return (
    <>
      <CustomNavbar />
      <div>
        {loading ? (
          <p>Cargando turnos...</p>
        ) : (
          <BootstrapTable keyField="id" data={appointments} columns={columns} />
        )}
      </div>
    </>
  );
};

export default MyAppointments;
