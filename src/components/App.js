import React, { useState } from 'react';
import './App.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componente de registro de usuario
function RegistrationForm({ onRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validateForm = () => {
    let isValid = true;

    if (!name) {
      setNameError('Ingrese su nombre');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      setEmailError('Ingrese un correo electrónico válido');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!phone || !/^\d{10}$/.test(phone)) {
      setPhoneError('Ingrese un número de teléfono válido (10 dígitos)');
      isValid = false;
    } else {
      setPhoneError('');
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onRegister({ name, email, phone });
      setName('');
      setEmail('');
      setPhone('');
      setNameError('');
      setEmailError('');
      setPhoneError('');
    }
  };

  return (
    <div className="registration-form">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          {nameError && <span className="error">{nameError}</span>}
        </div>
        <div className="form-group">
          <label>Correo electrónico:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {emailError && <span className="error">{emailError}</span>}
        </div>
        <div className="form-group">
          <label>Número de teléfono:</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          {phoneError && <span className="error">{phoneError}</span>}
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

// Componente de creación de turnos
function AppointmentForm({ onAppointmentCreate }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [dateError, setDateError] = useState('');

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setDateError('');
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDate) {
      setDateError('Seleccione una fecha');
      return;
    }

    if (!selectedTime) {
      setDateError('Seleccione una hora');
      return;
    }

    const dateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    dateTime.setHours(hours);
    dateTime.setMinutes(minutes);

    onAppointmentCreate(dateTime);

    setSelectedDate(null);
    setSelectedTime(null);
    setDateError('');
  };

  return (
    <div className="appointment-form">
      <h2>Crear Turno</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Fecha:</label>
          <DatePicker selected={selectedDate} onChange={handleDateSelect} dateFormat="dd/MM/yyyy" />
        </div>
        <div className="form-group">
          <label>Hora:</label>
          <input type="time" value={selectedTime} onChange={(e) => handleTimeSelect(e.target.value)} />
        </div>
        {dateError && <span className="error">{dateError}</span>}
        <button type="submit">Crear</button>
      </form>
    </div>
  );
}

// Componente de notificaciones
function Notifications({ appointments }) {
  // Obtener la fecha actual
  const now = new Date();

  // Obtener la fecha y hora en 24 horas a partir de ahora
  const next24Hours = new Date();
  next24Hours.setHours(next24Hours.getHours() + 24);

  // Filtrar las citas dentro de las próximas 24 horas
  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.date >= now && appointment.date <= next24Hours
  );

  return (
    <div className="notifications">
      <h2>Notificaciones</h2>
      {upcomingAppointments.length > 0 ? (
        upcomingAppointments.map((appointment, index) => (
          <div className="notification" key={index}>
            <div className="notification-info">
              <div>RECORDATORIO: Tienes una cita para mañana con Fecha: {appointment.date.toLocaleString()}</div>
            </div>
          </div>
        ))
      ) : (
        <p>No hay notificaciones para las próximas 24 horas</p>
      )}
    </div>
  );
}

// Componente principal


function App() {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [comment, setComment] = useState('');

  const handleRegister = (user) => {
    setUsers((prevUsers) => [...prevUsers, user]);
    toast.success('Usuario registrado correctamente');
  };

  const handleAppointmentCreate = (dateTime) => {
    setAppointments((prevAppointments) => [
      ...prevAppointments,
      { date: dateTime, comment: null, rating: null },
    ]);
    toast.success('Turno creado correctamente');
  };

  const handleRateAppointment = (index, rating) => {
    const updatedAppointments = [...appointments];
    updatedAppointments[index].rating = rating;
    setAppointments(updatedAppointments);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = (index) => {
    const updatedAppointments = [...appointments];
    updatedAppointments[index].comment = comment;
    setAppointments(updatedAppointments);
    setComment('');
    toast.success('Comentario agregado correctamente');
  };

  const now = new Date();

  return (
    <div className="app">
      <ToastContainer />

      {!users.length && <RegistrationForm onRegister={handleRegister} />}
      {users.length > 0 && (
        <div>
          <h1>Bienvenido, {users[users.length - 1].name}!</h1>
          <AppointmentForm onAppointmentCreate={handleAppointmentCreate} />

          <div className="agenda">
            <h2>Agenda</h2>
            {appointments.length > 0 ? (
              <ul>
                {appointments.map((appointment, index) => {
                  const hasPassed = appointment.date < now;

                  return (
                    <li key={index}>
                      {appointment.date.toLocaleString()} -{' '}
                      {hasPassed ? (
                        <>
                          {appointment.comment ? (
                            <>
                              Comentario: {appointment.comment} - Calificación: {appointment.rating}
                            </>
                          ) : (
                            <>
                              <select
                                value={appointment.rating || ''}
                                onChange={(e) => handleRateAppointment(index, parseInt(e.target.value))}
                              >
                                <option value="">Seleccionar calificación</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                              </select>
                              <input
                                type="text"
                                placeholder="Agregar comentario"
                                value={comment}
                                onChange={handleCommentChange}
                              />
                              <button onClick={() => handleRateAppointment(index, null)}>
                                Cancelar calificación
                              </button>
                              <button onClick={() => handleRateAppointment(index, null)}>
                                Eliminar calificación y comentario
                              </button>
                              <button onClick={() => handleCommentSubmit(index)}>Enviar comentario</button>
                            </>
                          )}
                        </>
                      ) : (
                        'Cita pendiente'
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No hay turnos</p>
            )}
          </div>

          <Notifications appointments={appointments} />
        </div>
      )}
    </div>
  );
}



export default App;
