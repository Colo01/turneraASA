import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogin } from "../features/user";
import style from "../styles/General.module.css";
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
        // Validar y guardar el usuario en localStorage
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
              id: payload.id, // Asegúrate de guardar el ID aquí
            },
          })
        );
  
        payload.admin
          ? navigate("/users")
          : payload.operator
          ? navigate("/turnos_operator")
          : navigate("/welcome");
      })
      .catch((err) => {
        Report.failure(
          "Error en login",
          "Por favor, verifique su email y password.",
          "Ok"
        );
      });
  };
  

  return (
    <div className={style.mainContainer}>
      <div className={style.logoContainer}>
        <img
          className={style.largeLogo}
          src={require("../images/1.png")}
          alt="miTurno"
        />
        <img
          className={style.smallLogo}
          src={require("../images/2.png")}
          alt="miTurno"
        />
      </div>
      <div className={style.contentContainer}>
        <div>
          <h2>Login</h2>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                placeholder="Ingrese su email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                placeholder="Ingrese su contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <div className={style.boton}>
              <Button variant="secondary" type="submit">
                Ingresar
              </Button>
            </div>

            <Link className={style.link} to="/assist_password">
              Olvidé mi contraseña
            </Link>

            <div className={style.unregistred}>
              <p className={style.p}>Aún no tengo una cuenta</p>
              <Link to="/register">Registrarme</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
