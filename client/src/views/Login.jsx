import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogin } from "../features/user";
import style from "../styles/Login.module.css"; // Nueva hoja de estilos
import parseJwt from "../hooks/parseJwt";
import { Report } from "notiflix/build/notiflix-report-aio";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      userLogin({
        email,
        password,
      })
    )
      .then((user) => {
        const token = JSON.parse(localStorage.getItem("user")).data.token;
        const payload = parseJwt(token);

        if (!payload.id) {
          console.error("El payload no contiene el ID del usuario.");
          Report.failure(
            "Error",
            "No se pudo autenticar correctamente. Por favor, intenta nuevamente.",
            "Ok"
          );
          return;
        }

        localStorage.setItem(
          "user",
          JSON.stringify({
            data: {
              token,
              id: payload.id,
            },
          })
        );

        payload.admin
          ? navigate("/users")
          : payload.operator
          ? navigate("/turnos_operator")
          : navigate("/welcome");
      })
      .catch(() => {
        Report.failure(
          "Error en login",
          "Por favor, verifique su email y password.",
          "Ok"
        );
      });
  };

  return (
    <div className={style.mainContainer}>
      <div className={style.blurOverlay}></div>
      <div className={style.loginBox}>
        <div className={style.logoContainer}>
          <img
            className={style.logo}
            src={require("../images/usuario.png")}
            alt="miTurno"
          />
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Control
              className={style.input}
              placeholder="Correo Electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              className={style.input}
              placeholder="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <button type="submit" className={style.submitButton}>
                Ingresar
              </button>

          <div className={style.links}>
            <Link to="/assist_password">Olvidé mi contraseña</Link>
            <p>
              Aún no tengo una cuenta <Link to="/register">Registrarme</Link>
            </p>
          </div>
          
        </Form>
      </div>
    </div>
  );
}

export default Login;
