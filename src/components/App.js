import './App.css';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify';
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
  const [dateError, setDateError] = useState('');

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setDateError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDate) {
      setDateError('Seleccione una fecha');
      return;
    }

    onAppointmentCreate(selectedDate);
    setSelectedDate(null);
    setDateError('');
  };

  return (
    <div className="appointment-form">
      <h2>Creación de Turnos</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Fecha:</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateSelect}
            dateFormat="dd/MM/yyyy"
            placeholderText="Seleccione una fecha"
          />
          {dateError && <span className="error">{dateError}</span>}
        </div>
        <button type="submit">Programar Turno</button>
      </form>
    </div>
  );
}

// Componente de notificaciones
function Notifications({ notifications }) {
  return (
    <div className="notifications">
      <h2>Notificaciones</h2>
      {notifications.map((notification, index) => (
        <div className="notification" key={index}>
          {notification}
        </div>
      ))}
    </div>
  );
}

// Componente de agenda de turnos
function Agenda({ appointments, onRate }) {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(1);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleRatingChange = (e) => {
    setRating(Number(e.target.value));
  };

  const handleRateAppointment = (index) => {
    const appointment = appointments[index];
    const currentDate = new Date();

    if (appointment.date > currentDate) {
      toast.error('No se puede calificar un evento futuro');
      return;
    }

    if (appointment.rating !== null) {
      toast.warning('Ya se ha calificado este evento');
      return;
    }

    const updatedAppointments = [...appointments];
    updatedAppointments[index] = {
      ...appointment,
      comment,
      rating,
    };

    setComment('');
    setRating(1);
    onRate(updatedAppointments);
  };

  return (
    <div className="agenda">
      <h2>Agenda</h2>
      {appointments.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Comentario</th>
              <th>Calificación</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => (
              <tr key={index}>
                <td>{appointment.date.toLocaleDateString()}</td>
                <td>{appointment.comment}</td>
                <td>
                  {appointment.rating !== null ? (
                    <>
                      {appointment.rating}{' '}
                      <span className="stars">
                        {Array.from({ length: appointment.rating }, (_, i) => (
                          <i className="fa fa-star" key={i}></i>
                        ))}
                      </span>
                    </>
                  ) : (
                    <>
                      <input type="text" value={comment} onChange={handleCommentChange} />
                      <select value={rating} onChange={handleRatingChange}>
                        <option value={1}>1 estrella</option>
                        <option value={2}>2 estrellas</option>
                        <option value={3}>3 estrellas</option>
                        <option value={4}>4 estrellas</option>
                        <option value={5}>5 estrellas</option>
                      </select>
                      <button onClick={() => handleRateAppointment(index)}>Calificar</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay turnos programados</p>
      )}
    </div>
  );
}

// Componente principal de la aplicación
function App() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const handleRegister = (userData) => {
    setUser(userData);
  };

  const handleAppointmentCreate = (date) => {
    setAppointments([...appointments, { date, comment: null, rating: null }]);
    setNotifications([
      ...notifications,
      `Recordatorio: tienes un turno programado para el ${date}`,
    ]);
  };

  const handleRateAppointment = (updatedAppointments) => {
    setAppointments(updatedAppointments);
  };

  useEffect(() => {
    const currentDate = new Date();
    const notificationDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);

    const timeoutId = setTimeout(() => {
      const upcomingAppointments = appointments.filter(
        (appointment) => appointment.date.toLocaleDateString() === notificationDate.toLocaleDateString()
      );

      if (upcomingAppointments.length > 0) {
        toast.info(`Tienes ${upcomingAppointments.length} eventos próximos en 24 horas`);
      }
    }, notificationDate.getTime() - currentDate.getTime());

    return () => {
      clearTimeout(timeoutId);
    };
  }, [appointments]);

  return (
    <div className="app">
      <ToastContainer />
      <header>
        <nav>
          <h1>MeTocaFinal LTDA.</h1>
          <button className="notification-btn">Notificaciones ({notifications.length})</button>
        </nav>
      </header>
      <main>
        <div className="container">
          {!user && <RegistrationForm onRegister={handleRegister} />}
          {user && (
            <div>
              <h1>Bienvenido, {user.name}!</h1>
              <div className="dashboard">
                <div className="sidebar">
                  <AppointmentForm onAppointmentCreate={handleAppointmentCreate} />
                  <Notifications notifications={notifications} />
                </div>
                <div className="content">
                  <Agenda appointments={appointments} onRate={handleRateAppointment} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
