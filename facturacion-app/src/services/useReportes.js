import { useState } from 'react';

const API_URL = "http://localhost:4000/facturas"

export const useReportes = () => {
    const [filtros, setFiltros] = useState({
        codigo: '',
        grado: '',
        anio: '',
        mes: '',
    });

    const [resultados, setResultados] = useState(/** @type {any[]} */ ([]));
    const [cargando, setCargando] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFiltros({
            ...filtros,
            [name]: value
        });
    }

    const obtenerReportes = async () => {
        setCargando(true);
        try {
            const parametros = new URLSearchParams(filtros).toString();
            const response = await fetch(`${API_URL}/reportesfactura?${parametros}`);
            const data = await response.json();
            setResultados(data);
            console.log("el vector del array es:", data);
        } catch (error) {
            console.error("Error al obtener reportes:", error);
        } finally {
            setCargando(false);
        }

    };

    return {
        filtros,
        handleInputChange,
        obtenerReportes,
        resultados,
        cargando};
};