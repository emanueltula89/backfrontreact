import React, { useState, useEffect } from 'react';
import './App.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  });
  const [responseMessage, setResponseMessage] = useState('');
  const [entries, setEntries] = useState([]);
  const [view, setView] = useState('form'); // 'form' o 'chart'

  // Función para cargar los datos de la API
  const fetchEntries = async () => {
    try {
      const response = await fetch('http://localhost:8000/entries');
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Error al cargar las entradas:', error);
    }
  };

  // Cargar los datos cuando el componente se monta o la vista cambia a 'chart'
  useEffect(() => {
    if (view === 'chart') {
      fetchEntries();
    }
  }, [view]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage('Enviando...');

    const API_URL = 'https://backfrontreact.onrender.com/submit'; 

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      setResponseMessage(`Éxito: ${result.message}`);
      setFormData({ nombre: '', email: '', mensaje: '' }); // Limpiar formulario
      // Opcional: recargar entradas después de un envío exitoso si estamos en vista de gráfico
      if (view === 'chart') {
        fetchEntries();
      }

    } catch (error) {
      setResponseMessage(`Error al enviar: ${error.message}`);
      console.error('Error al enviar el formulario:', error);
    }
  };

  // Preparar datos para el gráfico
  const chartData = {
    labels: entries.map((entry, index) => `Entrada ${index + 1}`), // Etiquetas para cada entrada
    datasets: [
      {
        label: 'Longitud del Mensaje',
        data: entries.map(entry => entry.mensaje ? entry.mensaje.length : 0), // Ejemplo: longitud del mensaje
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Longitud de Mensajes Enviados',
      },
    },
  };

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <button onClick={() => setView('form')}>Formulario</button>
          <button onClick={() => setView('chart')}>Ver Gráfico</button>
        </nav>

        {view === 'form' ? (
          <>
            <h1>Formulario de Contacto</h1>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="nombre">Nombre:</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="mensaje">Mensaje:</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit">Enviar Mensaje</button>
            </form>
            {responseMessage && <p className="response-message">{responseMessage}</p>}
          </>
        ) : (
          <>
            <h1>Gráfico de Entradas</h1>
            {entries.length > 0 ? (
              <div style={{ width: '80%', height: '400px' }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            ) : (
              <p>No hay datos para mostrar en el gráfico. Envía algunos mensajes primero.</p>
            )}
          </>
        )}
      </header>
    </div>
  );
}

export default App;