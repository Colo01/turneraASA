// client/src/views/BranchOffices.jsx

import React, { useState, useEffect } from "react";
import Badge from "react-bootstrap/Badge";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomNavbar from "../commons/CustomNavbar";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import Button from "react-bootstrap/Button";
import parseJwt from "../hooks/parseJwt";

import style from "../styles/BranchOffices.module.css";

const BranchOffices = ({ selectOffice }) => {
  const [offices, setOffices] = useState([]);
  const [load, setLoad] = useState(true);

  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("user")).data.token;

  useEffect(() => {
    loadOffices();
  }, [load]);

  const loadOffices = () => {
    axios
      .get("http://localhost:5000/api/deliveryPoint", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const officesConstructor = res.data.data.map((office) => ({
          id: office._id.slice(-4),
          name: `${office.location} - ${office.address}`,
          isOpen: `${office.startTime} a ${office.endTime} hs`,
          simultAppointment: office.appointments.length || 0,
          actions: (
            <>
              <Badge
                bg="secondary"
                role="button"
                title="Editar"
                onClick={() => handleEdit(office)}
              >
                <i className="bi bi-pencil"></i>
              </Badge>
              &nbsp;&nbsp;
              <Badge
                bg="danger"
                role="button"
                title="Eliminar"
                onClick={() => handleDelete(office._id)}
              >
                <i className="bi bi-trash"></i>
              </Badge>
            </>
          ),
        }));
        setOffices(officesConstructor);
      })
      .catch((err) => console.error("Error al cargar oficinas:", err));
  };

  const handleEdit = (office) => {
    selectOffice(office);
    navigate("/officeDetails");
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/deliveryPoint/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setLoad(!load);
      })
      .catch((err) => console.error("Error al eliminar sucursal:", err));
  };

  const columns = [
    {
      dataField: "id",
      text: "ID",
      headerAlign: "center",
      align: "center",
      sort: true,
    },
    {
      dataField: "name",
      text: "Sucursal",
      headerAlign: "center",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "isOpen",
      text: "Horario de atención",
      headerAlign: "center",
      align: "center",
    },
    {
      dataField: "simultAppointment",
      text: "Turnos en simultáneo",
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
            <BootstrapTable
              keyField="id"
              data={offices}
              columns={columns}
              filter={filterFactory()}
              pagination={paginationFactory()}
              striped
              hover
              condensed
            />
          </div>
          <div className={style.buttonsContainer}>
            <Button
              href="/createDeliveryPoint"
              variant="secondary"
              className={style.buttons}
            >
              + Agregar sucursal
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BranchOffices;
