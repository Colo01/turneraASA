import React, { useState, useEffect } from "react";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import Button from "react-bootstrap/Button";
import CustomNavbar from "../commons/CustomNavbar";
import filterFactory from "react-bootstrap-table2-filter";
import style from "../styles/Calendar.module.css";
import { Report } from "notiflix/build/notiflix-report-aio";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const [offices, setOffices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const token = JSON.parse(localStorage.getItem("user"))?.data?.token;
  const navigate = useNavigate();

  useEffect(() => {
    loadOffices();
  }, []);

  useEffect(() => {
    if (selectedOffice) {
      loadAppointments(selectedOffice._id);
    }
  }, [selectedOffice]);

  const loadOffices = () => {
    axios
      .get("http://localhost:5000/api/deliveryPoint", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOffices(res.data.data);
      })
      .catch((err) => console.error("Error al cargar sucursales:", err));
  };

  const loadAppointments = (officeId) => {
    if (!officeId) {
      console.warn("No hay una sucursal seleccionada.");
      return;
    }
    axios
      .get(
        `http://localhost:5000/api/appointment/availableAppointments?deliveryPointId=${officeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        const appointmentsData = res.data.data.map((appointment) => ({
          id: appointment._id,
          date: appointment.date,
          time: appointment.time,
          state: appointment.state,
          actions: (
            <Button
              variant="primary"
              onClick={() => handleReserve(appointment._id)}
            >
              Reservar Turno
            </Button>
          ),
        }));
        setAppointments(appointmentsData);
      })
      .catch((err) => console.error("Error al cargar turnos:", err));
  };

  const handleReserve = async (appointmentId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.data?.id;
  
    if (!userId || !appointmentId) {
      Report.failure(
        "Error",
        "No se pudo reservar el turno. Faltan datos requeridos.",
        "Ok"
      );
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/appointment/reserve",
        { userId, appointmentId },
        { headers: { Authorization: `Bearer ${user.data.token}` } }
      );
  
      Report.success(
        "Reserva Exitosa",
        response.data.message,
        "Ir a Mis Turnos",
        () => navigate("/myappointments")
      );
  
      // Actualizar lista de turnos disponibles
      if (selectedOffice) loadAppointments(selectedOffice._id);
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Error al reservar turno.";
      Report.failure("Error", errorMsg, "Ok");
      console.error("Error al reservar turno:", error);
    }
  };  
  

  const officeOptions = offices.map((office) => (
    <option key={office._id} value={office._id}>
      {office.location} - {office.address}
    </option>
  ));

  const columns = [
    {
      dataField: "date",
      text: "Fecha",
      headerAlign: "center",
      align: "center",
    },
    {
      dataField: "time",
      text: "Hora",
      headerAlign: "center",
      align: "center",
    },
    {
      dataField: "state",
      text: "Estado",
      headerAlign: "center",
      align: "center",
    },
    {
      dataField: "actions",
      text: "Acciones",
      headerAlign: "center",
      align: "center",
    },
  ];

  return (
    <>
      <CustomNavbar />
      <div className={style.mainContainer}>
        <div className={style.contentContainer}>
          <div className={style.tableContainer}>
            <h2 style={{ textAlign: "center", color: "#fff" }}>
              Calendario de Turnos
            </h2>
            <select
              className="form-select"
              onChange={(e) =>
                setSelectedOffice(offices.find((o) => o._id === e.target.value))
              }
              style={{ margin: "20px 0", padding: "10px" }}
            >
              <option value="">Selecciona una sucursal</option>
              {officeOptions}
            </select>
            <BootstrapTable
              keyField="id"
              data={appointments}
              columns={columns}
              pagination={paginationFactory()}
              filter={filterFactory()}
              striped
              hover
              condensed
            />
          </div>
        </div>
      </div>
    </>
  );  
};

export default Calendar;
