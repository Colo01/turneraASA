import React, { useEffect, useState } from "react";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import Button from "react-bootstrap/Button";
import style from "../styles/BranchOffices.module.css";

const DeliveryPoints = () => {
  const [deliveryPoints, setDeliveryPoints] = useState([]);

  useEffect(() => {
    loadDeliveryPoints();
  }, []);

  const loadDeliveryPoints = () => {
    axios
      .get("http://localhost:5000/api/deliveryPoint") // Endpoint para obtener los puntos de entrega
      .then((res) => {
        const points = res.data.data.map((point, index) => ({
          id: point._id.slice(-4),
          name: `${point.location} - ${point.address}`,
          hours: `${point.startTime} - ${point.endTime}`,
        }));
        setDeliveryPoints(points);
      })
      .catch((err) => console.error("Error al cargar puntos de entrega:", err));
  };

  const columns = [
    {
      dataField: "id",
      text: "ID",
      sort: true,
    },
    {
      dataField: "name",
      text: "Punto de Entrega",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "hours",
      text: "Horario",
    },
  ];

  return (
    <div className={style.mainContainer}>
      <h4>Puntos de Entrega</h4>
      <BootstrapTable
        keyField="id"
        data={deliveryPoints}
        columns={columns}
        pagination={paginationFactory()}
        filter={filterFactory()}
      />
      <Button
        variant="secondary"
        onClick={() => {
          window.location.href = "/createDeliveryPoint"; // Redirige a la creación
        }}
      >
        + Agregar Punto de Entrega
      </Button>
    </div>
  );
};

export default DeliveryPoints;
