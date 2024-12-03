// client/src/views/MyAppointments.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import CustomNavbar from "../commons/CustomNavbar";
import paginationFactory from "react-bootstrap-table2-paginator";
import style from "../styles/MyAppointments.module.css";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("user")).data.token;

  const loadAppointments = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user")).data.id;
      const response = await axios.get(`http://localhost:5000/api/appointment/myAppointments?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setAppointments(
        response.data.data.map((appointment) => ({
          id: appointment._id.slice(-4),
          date: appointment.date,
          time: appointment.time,
          state: appointment.state,
          location: appointment.deliveryPoint?.location || "Sin ubicación",
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
    { dataField: "id", text: "ID", headerAlign: "center", align: "center", sort: true },
    { dataField: "date", text: "Fecha", headerAlign: "center", align: "center" },
    { dataField: "time", text: "Hora", headerAlign: "center", align: "center" },
    { dataField: "state", text: "Estado", headerAlign: "center", align: "center" },
    { dataField: "location", text: "Ubicación", headerAlign: "center", align: "center" },
  ];

  return (
    <>
      <CustomNavbar />
      <div className={style.mainContainer}>
        <div className={style.contentContainer}>
          <div className={style.tableContainer}>
            {loading ? (
              <p style={{ textAlign: "center", color: "#fff" }}>Cargando turnos...</p>
            ) : (
              <BootstrapTable
                keyField="id"
                data={appointments}
                columns={columns}
                pagination={paginationFactory()}
                striped
                hover
                condensed
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAppointments;
