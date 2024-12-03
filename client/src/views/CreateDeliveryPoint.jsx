import React, { useState } from "react";
import axios from "axios";
import CustomNavbar from "../commons/CustomNavbar";
import Button from "react-bootstrap/esm/Button";
import parseJwt from "../hooks/parseJwt";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Report } from "notiflix/build/notiflix-report-aio";

import style from "../styles/OfficeDetails.module.css";

const CreateDeliveryPoint = () => {
  const token = JSON.parse(localStorage.getItem("user")).data.token;
  const payload = parseJwt(token);
  const navigate = useNavigate();

  const [previewAppointments, setPreviewAppointments] = useState([]);

  const handlePreview = (values) => {
    const startTime = parseInt(values.startTime.split(":")[0]) * 60 + parseInt(values.startTime.split(":")[1]);
    const endTime = parseInt(values.endTime.split(":")[0]) * 60 + parseInt(values.endTime.split(":")[1]);
    const interval = parseInt(values.interval);

    const appointments = [];
    for (let time = startTime; time < endTime; time += interval) {
      const hour = Math.floor(time / 60).toString().padStart(2, "0");
      const minute = (time % 60).toString().padStart(2, "0");
      appointments.push(`${hour}:${minute}`);
    }

    setPreviewAppointments(appointments);
  };

  const handleSubmit = (values) => {
    axios
      .post(`http://localhost:5000/api/deliveryPoint/admin/${payload.id}/add`, values)
      .then((res) => {
        console.log("Punto de entrega creado:", res.data);
        Report.success(
          "Se ha creado un nuevo punto de entrega",
          "Ok",
          "Okay",
          () => navigate("/offices")
        );
      })
      .catch((err) => {
        console.error("Error al crear el punto de entrega", err);
        Report.failure(
          "Error",
          "No se pudo crear el punto de entrega",
          "Ok"
        );
      });
  };

  const validate = Yup.object({
    address: Yup.string().required("Ingresar una dirección."),
    location: Yup.string().required("Ingresar una localidad."),
    phone: Yup.string().required("Ingresar un teléfono válido."),
    email: Yup.string()
      .email("Formato de email inválido.")
      .required("Ingresar un email."),
    startTime: Yup.string().required("Ingresar la hora de apertura."),
    endTime: Yup.string().required("Ingresar la hora de cierre."),
    interval: Yup.number()
      .min(5, "El intervalo debe ser de al menos 5 minutos.")
      .required("Ingresar el intervalo entre turnos."),
  });

  return (
    <>
      <CustomNavbar />
      <div className={style.mainContainer}>
        <Formik
          initialValues={{
            address: "",
            location: "",
            phone: "",
            email: "",
            startTime: "",
            endTime: "",
            interval: 5, // Valor predeterminado
          }}
          validationSchema={validate}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {(formik) => (
            <div className={style.contentContainer}>
              <Form>
                <div className={style.nameContainer}>
                  <h4>Nuevo Punto de Entrega</h4>
                </div>
                <div className={style.dataContainer}>
                  <div className={style.leftDataContainer}>
                    <div className={style.generalContainer}>
                      <div className={style.generalContainerTitle}>
                        <h5>Datos del Punto de Entrega</h5>
                      </div>
                      <ul>
                        <li>ID:&emsp;sin asignar</li>
                        <li>
                          Dirección:&emsp;
                          <div className="form-group">
                            <Field
                              name="address"
                              className="form-control"
                              type="text"
                            />
                          </div>
                        </li>
                        <li>
                          Localidad:&emsp;
                          <div className="form-group">
                            <Field
                              name="location"
                              className="form-control"
                              type="text"
                            />
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className={style.generalContainer}>
                      <div className={style.generalContainerTitle}>
                        <h5>Datos de Contacto</h5>
                      </div>
                      <ul>
                        <li>
                          Teléfono:&emsp;
                          <div className="form-group">
                            <Field
                              name="phone"
                              className="form-control"
                              type="text"
                            />
                          </div>
                        </li>
                        <li>
                          E-mail:&emsp;
                          <div className="form-group">
                            <Field
                              name="email"
                              className="form-control"
                              type="email"
                            />
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className={style.generalContainer}>
                      <div className={style.generalContainerTitle}>
                        <h5>Horarios de Atención</h5>
                      </div>
                      <ul>
                        <li>
                          Hora de apertura:&emsp;
                          <div className="form-group">
                            <Field
                              name="startTime"
                              className="form-control"
                              type="time"
                            />
                          </div>
                        </li>
                        <li>
                          Hora de cierre:&emsp;
                          <div className="form-group">
                            <Field
                              name="endTime"
                              className="form-control"
                              type="time"
                            />
                          </div>
                        </li>
                        <li>
                          Intervalo (minutos):&emsp;
                          <div className="form-group">
                            <Field
                              name="interval"
                              className="form-control"
                              type="number"
                            />
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className={style.previewContainer}>
                  <h5>Previsualización de Turnos</h5>
                  <Button
                    variant="secondary"
                    onClick={() => handlePreview(formik.values)}
                  >
                    Generar Previsualización
                  </Button>
                  <ul>
                    {previewAppointments.map((time, index) => (
                      <li key={index}>{time}</li>
                    ))}
                  </ul>
                </div>
                <div className={style.buttonsContainer}>
                  <div className={style.startButtons}>
                    <Button
                      variant="secondary"
                      className={style.buttons}
                      href="/offices"
                    >
                      <i className="bi bi-arrow-left-circle-fill"></i>
                      &nbsp;&nbsp;Volver
                    </Button>
                  </div>
                  <div className={style.endButtons}>
                    <Button
                      variant="secondary"
                      className={style.buttons}
                      onClick={() => {
                        formik.resetForm();
                        setPreviewAppointments([]);
                      }}
                    >
                      Borrar formulario
                    </Button>
                    <Button
                      type="submit"
                      variant="secondary"
                      className={style.buttons}
                    >
                      Crear Punto de Entrega
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          )}
        </Formik>
      </div>
    </>
  );
};

export default CreateDeliveryPoint;
