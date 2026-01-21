import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logocv from "../assets/Logo.webp" 
import iconoperfil from "../assets/Profile.png"
import "../Inicio/navegacion.css"

const Sidebar = () => {
    const navigate = useNavigate();
    
    return(
        /* Usamos la nueva clase .app-layout */
        <div className="app-layout"> 
            <div className="sidebar">
                <div className="logo">
                    <img src={logocv} alt="Perfil"></img>
                </div>
                
                <div className="Menu">
                    <div className="menu-item" onClick={() => navigate("/Layout/asignar-pago")}>
                        <i className="icon-waller"></i>
                        <span>Asignar pago</span>
                    </div>
                    
                    <div className="menu-item" onClick={() => navigate("/Layout/pago-manual")}>
                        <i className="icon-check"></i>
                        <span>Pago Manual</span>
                    </div>

                    <div className="menu-item" onClick={() => navigate("/Layout/reportes")}>
                        <i className="icon-file"></i>
                        <span>Reportes</span>
                    </div>
                </div>

                <div className="User">
                    <img src={iconoperfil} alt="Perfil" />
                    <span>Laura S.</span>
                </div>
            </div>
            
            {/* Usamos la nueva clase .main-content-wrapper */}
            <main className="main-content-wrapper">
                <Outlet />
            </main>
        </div>
    )
}

export default Sidebar;