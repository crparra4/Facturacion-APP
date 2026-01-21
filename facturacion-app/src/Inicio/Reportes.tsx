import React, { useState, useEffect } from 'react';
import './reportes.css';
import { useReportes } from '../services/useReportes';
import iconotarjeta from "../assets/metodo-de-pago.png";
import busquedad from "../assets/busquedadL.png";
import resporterIcon from "../assets/ReportesIcon.png"
import {generar_Years} from "../services/fechaAutomatica"

function Reportes() {
  const [darkMode, setDarkMode] = useState(false);
  const listaAnios = generar_Years(0,4)
  const { filtros, handleInputChange, obtenerReportes, resultados, cargando } = useReportes(); 
  
  const meses = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" },
  ];


  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="reportes-container">
      <div className="reportes-content">
        
        {/* Header */}
        <header className="reportes-header">
          <div className="icon-badge">
            <img src={iconotarjeta} alt="Reportes" />
          </div>
          <div>
            <h1>Reportes de pago Manual</h1>
            <p>Consulta y genera reportes detallados de las modificaciones realizadas a los pagos de estudiantes en el sistema.</p>
          </div>
        </header>

        {/* Filtros */}
        <section className="filter-card">
          <div className="filter-header">
            <div className="filter-circle">
              <img src={busquedad} alt="Buscar" />
            </div>
            <div>
              <h2 className="filter-title-text">Filtro de búsqueda</h2>
              <span className="filter-sub-text">Define los criterios para generar tu reporte personalizado</span>
            </div>
          </div>

          <form>
            <div className="form-grid">
              <div className="form-group">
                <label>Codigo Estudiante:</label>
                <input  name="codigo" className="form-control" placeholder="EJ - 67001025" type="text" value={filtros.codigo} onChange={handleInputChange} />
              </div>

              <div className="form-group">
                <label>Grado:</label>
                <select  name="grado" className="form-control" value={filtros.grado} onChange={handleInputChange}>
                    <option value="" >Selecciona el grado</option>
                    {Array .from({ length: 11 }, (_, i) => i + 1).map((grado) => (
                        <option key={grado} value={grado}>{grado}</option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label>Año:</label>
                <select name="anio" className="form-control" value={filtros.anio} onChange={handleInputChange}>
                  <option value="">Seleccionar Año</option>
                  {listaAnios.map((anio) => (
                      <option key={anio} value={anio}>{anio}</option>
                  ))}

                </select>
              </div>

              <div className="form-group">
                <label>Mes de Pago:</label>
                <select name="mes" className="form-control" value={filtros.mes} onChange={handleInputChange}>
                  <option value="">Seleccionar Mes</option>
                  {meses.map((mes) => (
                      <option key={mes.value} value={mes.value}>{mes.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <button className="btn-submit" type="button" onClick={obtenerReportes} disabled={cargando}>
              <img src={busquedad} alt="" />
              Generar Reporte
            </button>
          </form>
        </section>


        {/* Dark Mode Button */}
        <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle">
          <span className="material-icons-round">
            {darkMode ? 'light' : 'dark'}
          </span>
        </button>
                  
        {resultados.length > 0 ? (
          <section className="results-section">
            <div className="results-header">
              <h2 style={{fontFamily: 'Playfair Display', margin: 0}}>Resultado del Reporte</h2>
              <p style={{color: '#6b7280', fontSize: '0.9rem'}}>Listado de pagos manuales realizados según los filtros aplicados</p>
            </div>

            <table className="results-table">
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Estudiante</th>
                  <th>Grado</th>
                  <th>Periodo</th>
                  <th>Valor Total</th>
                  <th>Valor Modificado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((item: any, index: number) => (
                  <tr key={index}>
                    <td>{item.codigo}</td>
                    <td>{item.estudiante}</td>
                    <td>{item.grado} Grado</td>
                    <td>{new Date(item.periodo).toLocaleDateString()}</td>
                    <td>${item.monto_pagado?.toLocaleString()}</td>
                    <td>
                      ${item.pago}
                    </td>
                    <td>
                      <button className="btn-icon">👁️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Resumen Inferior */}
            <div className="summary-grid">
              <div className="summary-card">
                <h4>Total Registros</h4>
                <p>{resultados.length}</p>
              </div>
              <div className="summary-card mod">
                <h4>Modificados</h4>
                <p>{resultados.filter(r => r.valor !== r.valor_original).length}</p>
              </div>
              <div className="summary-card total">
                <h4>Valor Total</h4>
                <p>${resultados.reduce((acc, curr) => acc + Number(curr.monto_pagado), 0).toLocaleString()}</p>
              </div>
            </div>
          </section>
        ) : (
          /* Si no hay resultados, mostramos el Empty State que ya tenías */
          <section className="empty-state">
            <div className="icon-container">
              <img src={resporterIcon} alt="No hay datos" />
            </div>
            <h3>No hay reportes generados</h3>
            <p>Define los filtros de búsqueda arriba y haz clic en "Generar Reporte" para visualizar los resultados.</p>
          </section>
        )}
    </div>
  </div>
  );
}

export default Reportes;