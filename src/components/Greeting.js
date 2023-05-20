import React, { useState } from 'react';
import "./Greeting.css";



const Greeting = () => {
  const [usuario, setUsuario] = useState(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaTurno, setFechaTurno] = useState('');
  const [turnos, setTurnos] = useState([]);
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');

  const handleRegistro = (e) => {
    e.preventDefault();
    const nuevoUsuario = {
      nombre: nombre,
      email: email,
      telefono: telefono,
      historialTurnos: [],
    };
    setUsuario(nuevoUsuario);
    console.log('Usuario registrado:', nuevoUsuario);
  };

  const handleCrearTurno = (e) => {
    e.preventDefault();
    if (usuario) {
      const nuevoTurno = { fecha: fechaTurno };
      setTurnos([...turnos, nuevoTurno]);
      setUsuario({
        ...usuario,
        historialTurnos: [...usuario.historialTurnos, nuevoTurno],
      });
      console.log('Turno creado:', nuevoTurno);
      console.log(usuario);
    } else {
      console.log('No se puede crear el turno. Usuario no registrado.');
    }
  };

  const handleCalificar = (e) => {
    e.preventDefault();
    if (usuario) {
      const calificacionTurno = {
        calificacion,
        comentario,
        fecha: new Date().toLocaleDateString(),
      };
      const ultimoTurno = usuario.historialTurnos[usuario.historialTurnos.length - 1];
      ultimoTurno.calificacion = calificacionTurno;
      setUsuario({ ...usuario });
      console.log('Calificación y comentario:', calificacionTurno);
    } else {
      console.log('No se puede calificar. Usuario no registrado.');
    }
  };

  return (
    <div className='turno-app'>
      {!usuario ? (
        <div>
          <h1>Registro de Usuario</h1>
          <form onSubmit={handleRegistro}>
            <label>
              Nombre:
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Teléfono:
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </label>
            <br />
            <button type="submit">Registrarse</button>
          </form>
        </div>
      ) : (
        <div>
          <h1>Crear Turno</h1>
          <form onSubmit={handleCrearTurno}>
            <label>
              Fecha del turno:
              <input
                type="date"
                value={fechaTurno}
                onChange={(e) => setFechaTurno(e.target.value)}
                required
              />
            </label>
            <br />
            <button type="submit">Crear Turno</button>
          </form>

          <h1>Notificaciones y Recordatorios</h1>
          {turnos.length > 0 ? (
            turnos.map((turno, index) => (
              <div key={index}>
                <p>Turno programado para el {turno.fecha}</p>
                {/* Aquí puedes implementar la lógica para enviar notificaciones */}
              </div>
            ))
          ) : (
            <p>No hay turnos programados</p>
          )}

          <h1>Calificación y Comentarios</h1>
          <form onSubmit={handleCalificar}>
            <label>
              Calificación:
              <input
                type="number"
                min="1"
                max="5"
                value={calificacion}
                onChange={(e) => setCalificacion(Number(e.target.value))}
                required
              />
            </label>
            <br />
            <label>
              Comentario:
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                required
              />
            </label>
            <br />
            <button type="submit">Enviar Calificación</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Greeting;
