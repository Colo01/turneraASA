// client/src/views/Register.jsx

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userRegister } from "../features/user";
import style from "../styles/Register.module.css";
import { usePasswordToggle } from "../utils/togglePasswordVisibility";
import { Report } from "notiflix/build/notiflix-report-aio";

function Register() {
  const navigate = useNavigate();
  const [inputType, icon] = usePasswordToggle();
  const dispatch = useDispatch();

  const handleRegister = async (values) => {
    try {
      const { rePassword, ...dataToSend } = values;

      console.log("Datos enviados al backend:", dataToSend);
      const response = await dispatch(userRegister(dataToSend)).unwrap();

      if (response.success) {
        Report.success(
          "¡Registro exitoso!",
          "Recibirás un email confirmando tu registro.",
          "Ok"
        );
        navigate("/login");
      } else {
        Report.failure(
          "Ocurrió un problema...",
          response.msg || "Error desconocido",
          "Ok"
        );
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      Report.failure(
        "Ocurrió un problema...",
        error.message || "Error desconocido",
        "Ok"
      );
    }
  };

  // Esquema de validación
  const validate = Yup.object({
    fname: Yup.string()
      .required("Se requiere un nombre")
      .min(3, "Debe tener al menos 3 caracteres"),
    lname: Yup.string()
      .required("Se requiere un apellido")
      .min(2, "Debe tener al menos 2 caracteres"),
    dni: Yup.number()
      .typeError("El DNI debe ser un número")
      .required("Se requiere el DNI")
      .min(1000000, "El DNI debe tener al menos 7 dígitos")
      .max(99999999, "El DNI no puede tener más de 8 dígitos"),
    studentNumber: Yup.number()
      .typeError("El número de alumno debe ser un número")
      .required("Se requiere un número de alumno")
      .max(99999, "El número no puede superar las 5 cifras"),
    address: Yup.string()
      .required("Se requiere una numeración")
      .min(8, "La dirección debe ser más descriptiva"),
    email: Yup.string()
      .email("Email no válido")
      .required("Se requiere un email"),
    password: Yup.string()
      .required("Se requiere contraseña")
      .min(8, "Debe tener al menos 8 caracteres"),
    rePassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "La contraseña no coincide")
      .required("Se requiere confirmación de contraseña"),
    career: Yup.string()
      .required("Se requiere una carrera")
      .max(40, "La carrera no puede superar los 40 caracteres"),
    story: Yup.string()
      .required("Se requiere una historia")
      .max(500, "La historia debe ser breve (máximo 500 caracteres)"),
    birthdate: Yup.date()
      .max(new Date(), "La fecha de nacimiento no puede ser futura")
      .min(
        new Date(new Date().setFullYear(new Date().getFullYear() - 100)),
        "La fecha de nacimiento no puede ser mayor a 100 años atrás"
      )
      .required("Se requiere la fecha de nacimiento"),
  });

  return (
    <div className={style.mainContainer}>
      <div className={style.blurOverlay}></div>
      <div className={style.registerBox}>
        <div className={style.logoContainer}>
          <img
            className={style.logo}
            src={require("../images/usuario.png")}
            alt="miTurno"
          />
        </div>
        <Formik
          initialValues={{
            fname: "",
            lname: "",
            dni: "",
            studentNumber: "",
            address: "",
            email: "",
            password: "",
            rePassword: "",
            career: "",
            story: "",
            birthdate: "",
          }}
          validationSchema={validate}
          onSubmit={(values) => handleRegister(values)}
        >
          {({ touched, errors }) => (
            <Form>
              <div className={`${style.formGrid}`}>
                <div className={style.leftColumn}>
                  <div className={style.formGroup}>
                    <div className={style.inputContainer}>
                      <Field
                        name="fname"
                        placeholder="Nombre"
                        className={`${style.input} ${
                          touched.fname && errors.fname ? style.inputError : ""
                        }`}
                      />
                      {touched.fname && errors.fname && (
                        <span className={style.tooltip}>{errors.fname}</span>
                      )}
                    </div>
                  </div>
                  <div className={style.formGroup}>
                    <div className={style.inputContainer}>
                      <Field
                        name="dni"
                        placeholder="DNI"
                        type="number"
                        className={`${style.input} ${
                          touched.dni && errors.dni ? style.inputError : ""
                        }`}
                        maxLength="8" // Esto limita la cantidad de caracteres ingresados
                      />
                      {touched.dni && errors.dni && (
                        <span className={style.tooltip}>{errors.dni}</span>
                      )}
                    </div>
                  </div>
                  <div className={style.formGroup}>
                    <div className={style.inputContainer}>
                      <Field
                        name="address"
                        placeholder="Dirección (Calle y número)"
                        className={`${style.input} ${
                          touched.address && errors.address
                            ? style.inputError
                            : ""
                        }`}
                      />
                      {touched.address && errors.address && (
                        <span className={style.tooltip}>{errors.address}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={style.rightColumn}>
                  <div className={style.formGroup}>
                    <div className={style.inputContainer}>
                      <Field
                        name="lname"
                        placeholder="Apellido"
                        className={`${style.input} ${
                          touched.lname && errors.lname ? style.inputError : ""
                        }`}
                      />
                      {touched.lname && errors.lname && (
                        <span className={style.tooltip}>{errors.lname}</span>
                      )}
                    </div>
                  </div>
                  <div className={style.formGroup}>
                    <div className={style.inputContainer}>
                      <Field
                        name="studentNumber"
                        placeholder="Número de Alumno"
                        type="number"
                        className={`${style.input} ${
                          touched.studentNumber && errors.studentNumber
                            ? style.inputError
                            : ""
                        }`}
                      />
                      {touched.studentNumber && errors.studentNumber && (
                        <span className={style.tooltip}>
                          {errors.studentNumber}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={style.formGroup}>
                    <div className={style.inputContainer}>
                      <Field
                        name="career"
                        placeholder="Carrera universitaria"
                        className={`${style.input} ${
                          touched.career && errors.career
                            ? style.inputError
                            : ""
                        }`}
                      />
                      {touched.career && errors.career && (
                        <span className={style.tooltip}>{errors.career}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${style.formGroup} ${style.fullWidth}`}>
                <div className={style.inputContainer}>
                  <Field
                    name="email"
                    placeholder="Correo electrónico"
                    className={`${style.input} ${
                      touched.email && errors.email ? style.inputError : ""
                    }`}
                  />
                  {touched.email && errors.email && (
                    <span className={style.tooltip}>{errors.email}</span>
                  )}
                </div>
              </div>

              <div className={`${style.formGroup} ${style.fullWidth}`}>
                <div className={style.inputContainer}>
                  <Field
                    name="birthdate"
                    placeholder="Fecha de nacimiento"
                    type="date"
                    className={`${style.input} ${
                      touched.birthdate && errors.birthdate
                        ? style.inputError
                        : ""
                    }`}
                  />
                  {touched.birthdate && errors.birthdate && (
                    <span className={style.tooltip}>{errors.birthdate}</span>
                  )}
                </div>
              </div>

              <div className={style.formGrid}>
                <div className={style.formGroup}>
                  <div className={style.inputContainer}>
                    <Field
                      name="password"
                      placeholder="Contraseña"
                      type={inputType}
                      className={`${style.input} ${
                        touched.password && errors.password
                          ? style.inputError
                          : ""
                      }`}
                    />
                    {touched.password && errors.password && (
                      <span className={style.tooltip}>{errors.password}</span>
                    )}
                  </div>
                </div>
                <div className={style.formGroup}>
                  <div className={style.inputContainer}>
                    <Field
                      name="rePassword"
                      placeholder="Confirmar contraseña"
                      type="password"
                      className={`${style.input} ${
                        touched.rePassword && errors.rePassword
                          ? style.inputError
                          : ""
                      }`}
                    />
                    {touched.rePassword && errors.rePassword && (
                      <span className={style.tooltip}>{errors.rePassword}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className={style.formGroup}>
                <div className={style.inputContainer}>
                  <Field
                    name="story"
                    placeholder="Contanos tu historia"
                    as="textarea"
                    rows="4"
                    className={`${style.input} ${
                      touched.story && errors.story ? style.inputError : ""
                    }`}
                  />
                  {touched.story && errors.story && (
                    <span className={style.tooltip}>{errors.story}</span>
                  )}
                </div>
              </div>
              <button type="submit" className={style.submitButton}>
                Registrarme
              </button>
              <div className={style.links}>
                <p>
                  Ya tengo una cuenta <Link to="/login">Login</Link>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Register;
