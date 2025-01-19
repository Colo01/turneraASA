// client/src/views/MyAccount.jsx

import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import CustomNavbar from "../commons/CustomNavbar";
import Button from "react-bootstrap/Button";
import parseJwt from "../hooks/parseJwt";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import capitalize from "../hooks/capitalize";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import { useNavigate } from "react-router-dom";
import userImage from "../images/usuario.png";

import style from "../styles/MyAccount.module.css";
///Esquema de validation con Yup al comienzo
const validate = Yup.object({
  fname: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .required("El nombre es obligatorio"),
  lname: Yup.string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .required("El apellido es obligatorio"),
  dni: Yup.number()
    .typeError("El DNI debe ser un número")
    .min(1000000, "El DNI debe tener al menos 7 dígitos")
    .max(99999999, "El DNI no puede tener más de 8 dígitos")
    .required("El DNI es obligatorio"),
  email: Yup.string()
    .email("Debe ser un email válido")
    .required("El email es obligatorio"),
  birthdate: Yup.date()
    .max(new Date(), "La fecha de nacimiento no puede ser futura")
    .min(
      new Date(new Date().setFullYear(new Date().getFullYear() - 100)),
      "La fecha de nacimiento no puede ser mayor a 100 años atrás"
    )
    .required("La fecha de nacimiento es obligatoria"),
  studentNumber: Yup.number()
    .typeError("El número de alumno debe ser un número")
    .min(1, "El número de alumno debe ser positivo")
    .max(99999, "El número de alumno no puede superar las 5 cifras")
    .required("El número de alumno es obligatorio"),
  address: Yup.string()
    .min(8, "La dirección debe ser más descriptiva")
    .required("El domicilio es obligatorio"),
  career: Yup.string()
    .max(40, "La carrera no puede superar los 40 caracteres")
    .required("La carrera universitaria es obligatoria"),
  phone: Yup.string()
    .min(7, "El teléfono debe tener al menos 7 dígitos")
    .max(25, "El teléfono no puede tener más de 25 caracteres")
    .required("El teléfono es obligatorio"),
  story: Yup.string()
    .max(500, "La historia no puede superar los 500 caracteres")
    .optional(),
});
///////////////////////////////////////////////////////////////
const MyAccount = () => {
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("user")).data.token;
  const payload = parseJwt(token);
  console.log(payload);

  useEffect(() => {
    loadUserData();
  }, []);

  const [userData, setUserData] = useState(payload);

  const loadUserData = () => {
    axios
      .get(`http://localhost:5000/api/users/me/${payload.id}`)
      .then((res) => {
        console.log(res.data); // Verifica que los campos se están recibiendo
        setUserData(res.data); // Asegúrate de incluir todos los datos en el estado
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (values) => {
    Confirm.show(
      "miTurno",
      "¿Confirma que desea aplicar los cambios en su perfil?",
      "Si",
      "No",
      () => {
        axios
          .put(`http://localhost:5000/api/users/me/${payload.id}`, values)
          .then((res) => {
            console.log(res);
            loadUserData();
          })
          .catch((err) => console.log(err));
        setIsEditing(false);
      }
    );
  };

  const handleDelete = () => {
    Confirm.show(
      "miTurno",
      "¿Confirma que desea eliminar su cuenta?",
      "Si",
      "No",
      () => {
        axios
          .delete(
            `http://localhost:5000/api/users/admin/62c71168c261b4d23d5b93a5/delete/${payload.id}`
          )
          .then((res) => {
            localStorage.removeItem("user");
            navigate("/");
          })
          .catch((err) => console.log(err));
      }
    );
  };

  return (
    <>
      <CustomNavbar />
      <div className={style.mainContainer}>
        <Formik
          enableReinitialize
          initialValues={{
            lname: capitalize(userData.lname),
            fname: capitalize(userData.fname),
            dni: userData.dni,
            email: userData.email,
            birthdate: userData.birthdate?.split("T")[0],
            phone: userData.phone,
            address: userData.address,
            studentNumber: userData.studentNumber, // numero de alumno
            career: userData.career, // carrrera
            story: userData.story, // historia
            password: "", // Contraseña por defecto vacía
          }}
          validationSchema={validate} // Esquema de validación actualizado
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {(formik, isSubmitting) => (
            <div className={style.contentContainer}>
              <Form>
                <div className={style.userDetails}>
                  <img
                    src={userImage}
                    alt="User"
                    className={style.profileImage}
                  />
                  <h1 className={style.title}>Mi Perfil</h1>
                  <ul>
                    {/* Renderizamos "ID" y "Rol" solo si el usuario no es cliente */}
                    {userData.admin || userData.operator ? (
                      <li>
                        ID:&emsp;{payload.id}
                        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Rol:{" "}
                        {userData.admin
                          ? "AD"
                          : userData.operator
                          ? "OP"
                          : "CL"}
                      </li>
                    ) : null}
                    <li>
                      Apellido:&emsp;
                      {isEditing ? (
                        <div className="form-group">
                          <Field
                            name="lname"
                            placeholder="Apellido"
                            className={`form-control ${
                              formik.touched.lname && formik.errors.lname
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          {formik.touched.lname && formik.errors.lname ? (
                            <div className="invalid-feedback">
                              {formik.errors.lname}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        userData.lname
                      )}
                    </li>
                    <li>
                      Nombre:&emsp;
                      {isEditing ? (
                        <div className="form-group">
                          <Field
                            name="fname"
                            placeholder="Nombre"
                            className={`form-control ${
                              formik.touched.fname && formik.errors.fname
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          {formik.touched.fname && formik.errors.fname ? (
                            <div className="invalid-feedback">
                              {formik.errors.fname}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        userData.fname
                      )}
                    </li>
                    <li>
                      DNI:&emsp;
                      {isEditing ? (
                        <div className="form-group">
                          <Field
                            name="dni"
                            placeholder="DNI"
                            type="number"
                            className={`form-control ${
                              formik.touched.dni && formik.errors.dni
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          {formik.touched.dni && formik.errors.dni ? (
                            <div className="invalid-feedback">
                              {formik.errors.dni}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        userData.dni
                      )}
                    </li>
                    <li>
                      E-mail:&emsp;
                      {isEditing ? (
                        <div className="form-group">
                          <Field
                            name="email"
                            placeholder="Correo electrónico"
                            type="email"
                            className={`form-control ${
                              formik.touched.email && formik.errors.email
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          {formik.touched.email && formik.errors.email ? (
                            <div className="invalid-feedback">
                              {formik.errors.email}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        userData.email
                      )}
                    </li>
                    <li>
                      Fecha de nacimiento:&emsp;
                      {isEditing ? (
                        <div className="form-group">
                          <Field
                            name="birthdate"
                            type="date"
                            className={`form-control ${
                              formik.touched.birthdate &&
                              formik.errors.birthdate
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          {formik.touched.birthdate &&
                          formik.errors.birthdate ? (
                            <div className="invalid-feedback">
                              {formik.errors.birthdate}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        userData.birthdate
                      )}
                    </li>
                    <li>
                      Teléfono:&emsp;
                      {isEditing ? (
                        <div className="form-group">
                          <Field
                            name="phone"
                            placeholder="Teléfono"
                            type="text"
                            className={`form-control ${
                              formik.touched.phone && formik.errors.phone
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          {formik.touched.phone && formik.errors.phone ? (
                            <div className="invalid-feedback">
                              {formik.errors.phone}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        userData.phone
                      )}
                    </li>
                    <li>
                      Domicilio:&emsp;
                      {isEditing ? (
                        <div className="form-group">
                          <Field
                            name="address"
                            placeholder="Domicilio"
                            type="text"
                            className={`form-control ${
                              formik.touched.address && formik.errors.address
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          {formik.touched.address && formik.errors.address ? (
                            <div className="invalid-feedback">
                              {formik.errors.address}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        userData.address
                      )}
                    </li>
                    <li>
                      Número de alumno:&emsp;
                      {isEditing ? (
                        <div className="form-group">
                          <Field
                            name="studentNumber"
                            className={
                              formik.touched.studentNumber &&
                              formik.errors.studentNumber
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            type="number"
                          />
                          {formik.touched.studentNumber &&
                          formik.errors.studentNumber ? (
                            <div className="invalid-feedback">
                              {formik.errors.studentNumber}
                            </div>
                          ) : null}
                        </div>
                      ) : userData.studentNumber ? (
                        userData.studentNumber
                      ) : (
                        "No disponible"
                      )}
                    </li>
                    <li>
                      Carrera universitaria:&emsp;
                      {isEditing ? (
                        <div className="form-group">
                          <Field
                            name="career"
                            placeholder="Carrera Universitaria"
                            type="text"
                            className={
                              formik.touched.career && formik.errors.career
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                          />
                          {formik.touched.career && formik.errors.career ? (
                            <div className="invalid-feedback">
                              {formik.errors.career}
                            </div>
                          ) : null}
                        </div>
                      ) : userData.career ? (
                        capitalize(userData.career)
                      ) : (
                        "No disponible"
                      )}
                    </li>
                  </ul>
                </div>
                <div className={style.buttonsContainer}>
                  {isEditing ? (
                    <>
                      <Button
                        variant="secondary"
                        className={style.buttons}
                        onClick={() => {
                          formik.resetForm();
                          setIsEditing(false);
                        }}
                      >
                        Descartar Cambios
                      </Button>
                      <Button
                        type="submit"
                        variant="secondary"
                        className={style.buttons}
                      >
                        Confirmar Cambios
                      </Button>
                    </>
                  ) : (
                    <></>
                  )}
                  <Button
                    variant="secondary"
                    className={style.buttons}
                    onClick={() => {
                      setIsEditing(true);
                    }}
                  >
                    <i className="bi bi-pencil-square"></i>
                    &nbsp;&nbsp;Editar
                  </Button>
                  <Button
                    variant="secondary"
                    className={style.buttons}
                    onClick={() => {
                      handleDelete();
                    }}
                  >
                    Eliminar mi cuenta
                  </Button>
                </div>
              </Form>
            </div>
          )}
        </Formik>
      </div>
    </>
  );
};

export default MyAccount;
