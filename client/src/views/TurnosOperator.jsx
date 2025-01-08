import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import CustomNavbar from "../commons/CustomNavbar";
import axios from "axios";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import style from "../styles/Users.module.css";

const TurnosOperator = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("user")).data.token;
        const response = await axios.get(
          "http://localhost:5000/api/admin/appointments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointments(response.data.data);
      } catch (error) {
        setError(error.response?.data?.message || "Error al obtener los turnos");
      }
    };

    fetchAppointments();
  }, []);

  const markAttendance = (id, action) => {
    // Confirmación antes de cambiar el estado
    Confirm.show(
      "Confirmar asistencia",
      `¿Está seguro de marcar el turno como ${action}?`,
      "Sí",
      "No",
      async () => {
        try {
          const token = JSON.parse(localStorage.getItem("user")).data.token;
          await axios.put(
            `http://localhost:5000/api/admin/appointments/${id}/mark`,
            { action },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Filtra el turno marcado para eliminarlo de la tabla
          setAppointments((prevAppointments) =>
            prevAppointments.filter((appt) => appt._id !== id)
          );
        } catch (error) {
          setError(
            error.response?.data?.message || "Error al actualizar el turno"
          );
        }
      }
    );
  };

  const columns = [
    {
      dataField: "user.fname",
      text: "Nombre",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "user.dni",
      text: "DNI",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "date",
      text: "Fecha",
      sort: true,
    },
    {
      dataField: "time",
      text: "Hora",
      sort: true,
    },
    {
      dataField: "state",
      text: "Estado",
      sort: true,
    },
    {
      dataField: "actions",
      text: "Acciones",
      formatter: (_, row) => (
        <div>
          <button
            className={style.attendedBtn}
            onClick={() => markAttendance(row._id, "asistido")}
          >
            Asistido
          </button>
          <button
            className={style.absentBtn}
            onClick={() => markAttendance(row._id, "ausente")}
          >
            Ausente
          </button>
        </div>
      ),
    },
  ];

  const defaultSorted = [
    {
      dataField: "date",
      order: "asc",
    },
  ];

  return (
    <>
      <CustomNavbar />
      <div className={style.mainContainer}>
        <div className={style.contentContainer}>
          {error && <p className={style.error}>{error}</p>}
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
    </>
  );
};

export default TurnosOperator;
