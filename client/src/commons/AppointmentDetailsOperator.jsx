// client/src/commons/AppointmentDetailsOperator.jx

import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import style from "../styles/Users.module.css";
import { getFullDate } from "../utils/getFullDate";
import { getFixedTime } from "../utils/getFixedTime";
import parseJwt from "../hooks/parseJwt";
import { Report } from "notiflix";


const AppointmentDetailsOperator = () => {

  const user = parseJwt(JSON.parse(localStorage.getItem('user')).data.token)

  const pickedDate = useSelector(state => state.appointment)

  const pickedBranchOffice = useSelector(state => state.branchOffice.clickedOffice)

  const fakeAppointments = [
    {
      "id": "62d16e4963b504c72e76307c",
      "date": "2",
      "month": "7",
      "year": "2022",
      "day": "3",
      "time": "10:30",
      "available": false,
      "branchOffice": [
        "62c621154bf17c41fbe9cc97"
      ],
      "user": [
        "62d06cdcd7369af706902545"
      ],
      "createdAt": "2022-07-15T02:20:26.792Z",
      "updatedAt": "2022-07-15T02:20:29.152Z",
      "__v": 0,
      "state": "confirmado",
      "userApp": {
        "id": "62d06cdcd7369af706902545",
        "email": "matias@gmail.com",
        "phone": "1147849561",
        "fullname": "Matías Jaliff",
        "lname": "darin",
        "operator": false,
      }
    },
    {
      "id": "62d16ca663b504c72e762fe6",
      "date": "20",
      "month": "6",
      "year": "2022",
      "day": "3",
      "time": "11:00",
      "available": false,
      "branchOffice": [
        "62c621154bf17c41fbe9cc97"
      ],
      "user": [
        "62d06cdcd7369af706902545"
      ],
      "createdAt": "2022-07-15T02:20:26.792Z",
      "updatedAt": "2022-07-15T02:20:29.152Z",
      "__v": 0,
      "state": "confirmado",
      "userApp": {
        "id": "62d06cdcd7369af706902545",
        "email": "moria@gmail.com",
        "phone": "114745269",
        "fullname": "Moria Casan",
        "lname": "darin",
        "operator": false,
      }
    }
  ]
  
  const [appointments, setAppointments] = useState(fakeAppointments)

  // RUTA A CORREGIR - ES LA QUE PIDE AL BACK EL ARREGLO DE TURNOS PARA UN DIA Y HORARIO DETERMINADOS

 /*  const getAppointments = () => {
      axios.get(`http://localhost:5000/api/appointment/62c7123cc261b4d23d5b93a9/dayAppointments`, {
        headers: {
          date: '27',
          month: '6',
          year: '2022',
          time: '14:00',
          id: '62c621154bf17c41fbe9cc97'
        }
      })
      .then(arr => {
        console.log('USUARIOS CON ESTE TURNO SON ', arr.data.data)
        // buscar en el turno el idUser
        setAppointments(arr.data.data)
      })
      .catch(err => console.log(err))
    };
  }; */

  const handleAssitance = (appointment) => {
    axios.put(`http://localhost:5000/api/appointment/${user.id}/showAppointments`, {
      id: (appointment)
  })
    .then(() => {
      //appointments.splice(appointments.indexOf(appointment), 1)
      Report.success('miTurno', 'Se confirmó la asistencia del usuario', 'Ok');
    })
    .catch(err => Report.failure('miTurno', {err}, 'Ok'))
}

  // ESTA FUNCION PIDE AL BACK DATOS COPLETOS DEL USUARIO QUE POSEE UN DETERMINADO TURNO

  /* const getUser = (userId) => {
    return axios.get(`http://localhost:5000/api/users/me/${userId}`)
      .then(user => {
        console.log('USER ES ', user.data)
        return user.data
      })
      .catch(err => console.log(err))
  } */

  useEffect(()=> {
    //getAppointments()
  },[pickedDate])

  return pickedDate.date ? (
    <div className={style.userDetails}>
      <h5>Detalles del turno:</h5>
      <ul>
        {<li>Sucursal: {pickedBranchOffice.location.toUpperCase()}</li>}
        {<li>Fecha: {getFullDate(pickedDate)}</li>}
        {<li>Hora: {getFixedTime(pickedDate)} hs</li>}
      </ul>
      {fakeAppointments.length
      ? (
        <>
        <h5 className={style.agendados}> Usuarios agendados: </h5>
        <ul>
          {fakeAppointments.map(e => {
            //const userApp = getUser(e.user[0]);
            //console.log('USERAPP ES ', userApp)
            return (
            <>
              <div className={style.asistentes}>
                <li> {e.userApp.fullname} </li>
                <li> Teléfono: {e.userApp.phone}</li>
                <li> Email: {e.userApp.email}</li>
                <Button
                  variant="secondary"
                  className={style.sideButton}
                  onClick={() => {
                    handleAssitance(e.id)
                    }
                  }
                >
                  Asistió
                </Button>
              </div>
            </>
            )}
          )}  
        </ul>
        </>
        )
      : (
        <h5>NO HAY USUARIOS PARA ESTE TURNO</h5>
        )
      }
    </div>
    )
    :
    (
    <></>
    );
};

export default AppointmentDetailsOperator;