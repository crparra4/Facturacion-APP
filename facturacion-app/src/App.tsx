import './App.css'
import { Routes, Route, Navigate } from "react-router-dom"
import Login from './Formularios_Entrada/Login'
import Register  from './Formularios_Entrada/Register'
import Layout from './Inicio/navegacion'
import AsignacionPagos from './Inicio/AsignacionPagos'
import ManualPayment from './Inicio/ManualPayment'
import Reportes from './Inicio/Reportes'

function App() {
    return(
      <Routes>
        {/* RUTAS PUBLICAS */}
        {/* login por defecto */}
        <Route path='/' element = {<Login/>} />
        <Route path='/login' element = {<Login/>} />

        {/* register */}
        <Route path='/register' element = {<Register/>} />

        {/* Cualquier otra ruta */}
        <Route path="*" element={<Navigate to="/" />} />


        {/* RUTAS PRIVADAS */}
        <Route path='/Layout' element = {<Layout/>}>
            <Route path="asignar-pago" element={<AsignacionPagos />} />
            <Route path="pago-manual" element={<ManualPayment />} />
            <Route path='reportes' element={<Reportes />} />
        </Route>
      </Routes>
    )
}

export default App
