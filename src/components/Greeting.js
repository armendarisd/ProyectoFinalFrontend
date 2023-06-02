import React, { useState } from 'react';
import "./Greeting.css";

const Greeting = () => {
  const [usuario, setUsuario] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [notificados, setNotificados] = useState([]);
  const [notificacion, setNotificacion] = useState(null);

  const registrarUsuario = (nombre, email, telefono) => {
    const nuevoUsuario = {
      nombre,
      email,
      telefono,
      turnos: [],
    };
    setUsuario(nuevoUsuario);
  };

  const crearTurno = (fecha) => {
    const nuevoTurno = {
      fecha,
      valoracion: null,
    };
    setTurnos([...turnos, nuevoTurno]);
    usuario.turnos.push(nuevoTurno);
  };

  const valorarTurno = (indiceTurno, valoracion, comentario) => {
    usuario.turnos[indiceTurno].valoracion = {
      valoracion,
      comentario,
    };
  };

  const notificarTurno = (indiceTurno) => {
    const fechaTurno = usuario.turnos[indiceTurno].fecha;
    const fechaNotificacion = new Date(fechaTurno);
    fechaNotificacion.setDate(fechaNotificacion.getDate() - 1);
    const notificacion = `Recordatorio: Tienes un turno programado para el día ${fechaTurno}`;
    setNotificados([...notificados, indiceTurno]);
    setNotificacion({ fecha: fechaNotificacion, mensaje: notificacion });
  };

  return (
    <div className='turno-app'>
      {!usuario && (
        <div>
          <h2>Registro de usuario</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const nombre = e.target.nombre.value;
              const email = e.target.email.value;
              const telefono = e.target.telefono.value;
              registrarUsuario(nombre, email, telefono);
            }}
          >
            <input type="text" name="nombre" placeholder="Nombre" />
            <input type="email" name="email" placeholder="Correo electrónico" />
            <input type="tel" name="telefono" placeholder="Teléfono" />
            <button type="submit">Registrarse</button>
          </form>
        </div>
      )}

      {usuario && (
        <div >
          <h2>Bienvenido, {usuario.nombre}!</h2>

          <div className='notificacion'>
            <h3>Creación de turnos</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fecha = e.target.fecha.value;
                crearTurno(fecha);
                e.target.reset();
              }}
            >
              <input type="date" name="fecha" />
              <button type="submit">Crear turno</button>
            </form>
          </div>


          <div className='notificacion'>
            <h3>Valoración de turnos</h3>
            {turnos.length > 0 ? (
              <ul>
                {turnos.map((turno, index) => (
                  <li key={index}>
                    <p>Fecha: {turno.fecha}</p>
                    {turno.valoracion ? (
                      <p>
                        Valoración: {turno.valoracion.valoracion} estrellas<br />
                        Comentario: {turno.valoracion.comentario}
                      </p>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const valoracion = e.target.valoracion.value;
                          const comentario = e.target.comentario.value;
                          valorarTurno(index, valoracion, comentario);
                          e.target.reset();
                        }}
                      >
                        <input type="number" name="valoracion" placeholder="Valoración (1-5)" min="1" max="5" />
                        <input type="text" name="comentario" placeholder="Comentario" />
                        <button type="submit">Enviar valoración</button>
                      </form>
                    )}
                    {!notificados.includes(index) && (
                      <button onClick={() => notificarTurno(index)}>Notificar turno</button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay turnos registrados</p>
            )}
          </div>


          {notificacion && (
            <div className='notificacion'>
              <h3>Notificación</h3>
              <p>Fecha de la notificación: {notificacion.fecha.toLocaleDateString()}</p>
              <p>{notificacion.mensaje}</p>
            </div>
          )}

          {notificados.length > 0 && (
            <div className='notificacion'>
              <h3>Turnos notificados</h3>
              <ul>
                {notificados.map((indice) => (
                  <li key={indice}>
                    <p>Fecha: {turnos[indice].fecha}</p>
                    <p>Mensaje de notificación: {notificacion.mensaje}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Greeting;




