// client/src/views/welcome.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import CustomNavbar from "../commons/CustomNavbar";
import style from "../styles/Welcome.module.css";

const Welcome = () => {
  const navigate = useNavigate(); // Hook para manejar la navegación

  return (
    <>
      <CustomNavbar />
      <div className={style.mainContainer}>
        <div className={style.welcomeBox}>
          <h2 className={style.welcomeTitle}>Bienvenido a ASA</h2>
          <p className={style.welcomeText}>
            Querido Alumno, desde la Asociación Solidaria Adventista te damos la bienvenida a nuestro sistema de gestión de turnos
            para retirar tus alimentos, donde podrás reservarte un turno cada vez que exista una campaña disponible
            para hacerlo, como también revisar el estado de los turnos a los que has participado de alguna manera.
          </p>
          <div className={style.buttonContainer}>
            <button
              onClick={() => navigate("/calendar")} // Navega a la ruta /calendar
              className={style.button}
            >
              Sacar un turno
            </button>
            <button
              onClick={() => navigate("/myappointments")} // Navega a la ruta /myappointments
              className={style.button}
            >
              Ver mis turnos
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
