import React from "react";
import { useNavigate } from "react-router-dom";
import parseJwt from "../hooks/parseJwt";
import capitalize from "../hooks/capitalize";
import style from "../styles/CustomNavbar.module.css";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import { emptyBranchOffice } from "../features/branchOffice";
import { emptyAppointment } from "../features/appointment";
import { useDispatch } from "react-redux";

const CustomNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Obtener token y rol
  const token = JSON.parse(localStorage.getItem("user")).data.token;
  const payload = parseJwt(token);
  const role = payload.admin ? "AD" : payload.operator ? "OP" : "CL";

  // Función para cerrar sesión
  const handleLogout = () => {
    Confirm.show(
      "Cerrar Sesión",
      "¿Confirma que desea finalizar la sesión?",
      "Si",
      "No",
      () => {
        localStorage.removeItem("endTime");
        localStorage.removeItem("user");
        localStorage.removeItem("branches");
        dispatch(emptyAppointment());
        dispatch(emptyBranchOffice());
        navigate("/");
      }
    );
  };

  // Función para manejar navegación
  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <div className={style.navbar}>
      <div className={style.leftSection}>
        {/* Logo */}
        <img src={require("../images/3.png")} alt="Logo" className={style.logo} />
        {/* Texto "Hola [usuario]" */}
        <span className={style.userGreeting}>Hola {capitalize(payload.fname)}</span>
      </div>

      {/* Menú dinámico */}
      <div className={style.menu}>
        {role === "AD" && (
          <>
            <div className={style.menuItem} onClick={() => handleNavigation("/offices")}>
              Sucursales
            </div>
            <div className={style.menuItem} onClick={() => handleNavigation("/users")}>
              Usuarios
            </div>
            <div className={style.menuItem} onClick={() => handleNavigation("/turnos_operator")}>
              Turnos
            </div>
          </>
        )}
        {role === "OP" && (
          <div className={style.menuItem} onClick={() => handleNavigation("/turnos_operator")}>
            Turnos
          </div>
        )}
        {role === "CL" && (
          <>
            <div className={style.menuItem} onClick={() => handleNavigation("/calendar")}>
              Reservar
            </div>
            <div className={style.menuItem} onClick={() => handleNavigation("/myappointments")}>
              Mis Turnos
            </div>
          </>
        )}
        <div className={style.menuItem} onClick={() => handleNavigation("/myaccount")}>
          Mi Perfil
        </div>
        <div className={style.menuItem} onClick={handleLogout}>
          Logout
        </div>
      </div>
    </div>
  );
};

export default CustomNavbar;
