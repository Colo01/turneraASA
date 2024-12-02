import React, { useState, useEffect } from "react";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import Notiflix from "notiflix";
import style from "../styles/Users.module.css";

const OfficeOperator = () => {
  const [appointments, setAppointments] = useState([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, [load]);

  const loadAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/appointment/all");
      const appointmentData = response.data.data.map((appointment) => ({
        _id: appointment._id,
        user: `${appointment.user?.fname || "N/A"} ${appointment.user?.lname || "N/A"}`,
        dni: appointment.user?.dni || "N/A",
        email: appointment.user?.email || "N/A",
        branchOffice: appointment.branchOffice?.location || "N/A",
        address: appointment.branchOffice?.address || "N/A",
        date: `${appointment.date}/${appointment.month}/${appointment.year}`,
        time: appointment.time,
        state: appointment.state || "N/A",
        actions:
          appointment.state === "confirmado" ? (
            <>
              <button
                className="btn btn-success"
                onClick={() => handleAttendanceConfirmation(appointment._id)}
              >
                Presente
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleMarkAbsent(appointment._id)}
              >
                Ausente
              </button>
            </>
          ) : (
            <span>Acción no disponible</span>
          ),
      }));
      setAppointments(appointmentData);
    } catch (error) {
      console.error("Error al cargar los turnos:", error);
    }
  };

  const handleAttendanceConfirmation = (id) => {
    Notiflix.Confirm.show(
      "miTurno",
      "¿Confirma que el usuario asistió al turno?",
      "Sí",
      "No",
      () => {
        axios
          .put(`http://localhost:5000/api/appointment/confirmAttendance`, {
            appointmentId: id,
          })
          .then(() => {
            Notiflix.Notify.success("Asistencia confirmada con éxito.");
            setLoad(!load);
          })
          .catch((err) => {
            console.error("Error al confirmar asistencia:", err);
            Notiflix.Notify.failure("Error al confirmar la asistencia.");
          });
      },
      () => {
        Notiflix.Notify.info("Acción cancelada.");
      }
    );
  };

  const handleMarkAbsent = (id) => {
    Notiflix.Confirm.show(
      "miTurno",
      "¿Confirma que el usuario no asistió al turno?",
      "Sí",
      "No",
      () => {
        axios
          .put(`http://localhost:5000/api/appointment/markAbsent`, {
            appointmentId: id,
          })
          .then(() => {
            Notiflix.Notify.success("Turno marcado como ausente.");
            setLoad(!load);
          })
          .catch((err) => {
            console.error("Error al marcar como ausente:", err);
            Notiflix.Notify.failure("Error al marcar el turno como ausente.");
          });
      },
      () => {
        Notiflix.Notify.info("Acción cancelada.");
      }
    );
  };

  const columns = [
    {
      dataField: "user",
      text: "Usuario",
      headerAlign: "center",
      filter: textFilter(),
      sort: true,
    },
    {
      dataField: "dni",
      text: "DNI",
      headerAlign: "center",
      filter: textFilter(),
    },
    {
      dataField: "email",
      text: "Correo",
      headerAlign: "center",
    },
    {
      dataField: "branchOffice",
      text: "Sucursal",
      headerAlign: "center",
      sort: true,
    },
    {
      dataField: "address",
      text: "Dirección",
      headerAlign: "center",
    },
    {
      dataField: "date",
      text: "Fecha",
      headerAlign: "center",
      sort: true,
    },
    {
      dataField: "time",
      text: "Hora",
      headerAlign: "center",
      sort: true,
    },
    {
      dataField: "state",
      text: "Estado",
      headerAlign: "center",
      sort: true,
    },
    {
      dataField: "actions",
      text: "Acciones",
      headerAlign: "center",
    },
  ];

  const defaultSorted = [
    {
      dataField: "date",
      order: "asc",
    },
  ];

  return (
    <div className={style.mainContainer}>
      <div className={style.contentContainer}>
        <div className={style.tableContainer}>
          <BootstrapTable
            keyField="_id"
            data={appointments}
            columns={columns}
            defaultSorted={defaultSorted}
            filter={filterFactory()}
            pagination={paginationFactory()}
            striped
            hover
            condensed
          />
        </div>
      </div>
    </div>
  );
};

export default OfficeOperator;
