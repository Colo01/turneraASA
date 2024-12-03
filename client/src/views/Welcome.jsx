import React from "react";
import { Link } from "react-router-dom";
import CustomNavbar from "../commons/CustomNavbar";
import style from "../styles/Welcome.module.css";

const Welcome = () => {
  return (
    <>
      <CustomNavbar />
      <div className={style.mainContainer}>
        <div className={style.contentContainer}>
          <div>
            <Link to="/calendar" className={style.button}>
              Sacar un turno
            </Link>
          </div>
          <div>
            <Link to="/myappointments" className={style.button}>
              Ver mis turnos
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
