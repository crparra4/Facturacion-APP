import { useState } from "react";
import logocv from "../assets/Logo.webp" /* logo del colegio */ 
import iconGogle from "../assets/search.png" /* icono de google */
import "../Formularios_Entrada/Login.css"
import {RegisterRequest} from "../services/auth.services"
import { useNavigate } from "react-router-dom"



function Register(){
    const navigate = useNavigate()

    const[usuario , setUsuario] = useState("")
    const[password , setPassword] = useState("")
    const[fecha_nacimiento , setFecha_nacimiento] = useState("")
    const[correo , setCorreo] = useState("")
    const[error , setError] = useState("")
    const[mensaje , setMensaje] = useState("")

    const handleRegister =async(e: React.FormEvent) =>{
        e.preventDefault();
        setError("")
        setMensaje("")
        console.log("Esta son la credenciales", usuario , password , fecha_nacimiento , correo)

        try{
            const data = await RegisterRequest(usuario,password,fecha_nacimiento,correo)
            setMensaje(data.message)
            
            //LIMPIAR
            setUsuario("")
            setPassword("")
            setFecha_nacimiento("")
            setCorreo("")
        }catch(err){
            if(err instanceof Error){
                setError(err.message)
            }else{
                setError("Error desconocido")
            }
        }
    }


    return(
        <div className="login-container">
            <div className="login-card">
                <div className="logo">
                     <img src={logocv} alt="Logo" />
                </div>
                <h2>Registro</h2>
                <p className="subtitle">Bienvenido al Portal</p>
                <form onSubmit={handleRegister}>
                    {error && <p style={{color : "RED"}}>{error}</p>} 
                    {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
                     {/* Usuario Input Field */}
                      <label>Usuario:</label>
                       <div className="input-group">
                            <input
                                type="text"
                                placeholder="Ingresa tu Usuario"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                            />
                        </div>

                        {/* Contraseña Input Field */}
                        <label>Contraseña:</label>
                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Ingresa tu Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Correo Input Field */}
                       <label>Correo:</label>
                       <div className="input-group">
                            <input
                                type="email"
                                placeholder="Ingrese su Correo"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                            />
                        </div>

                        {/* Fecha Nacimiento Input Field */}
                       <label>Fecha Nacimiento:</label>
                       <div className="input-group">
                            <input
                                type="date"
                                placeholder="Ingrese su Fecha de Nacimiento"
                                value={fecha_nacimiento}
                                onChange={(e) => setFecha_nacimiento(e.target.value)}
                            />
                        </div>
                        
                        <p className= "forgot-password" onClick={()=> navigate("/login")}>
                            Volver al login
                        </p>
                        <button type="submit">Registrar</button>
                </form>

                <div className="divider"></div>
                {/* Google ICON */}
                <div className="google-login">
                    <img src={iconGogle} alt="Google Icon" />
                </div>

                <p className="terms">
                    Al registrarse, aceptas nuestros <a href="#">Términos y Condiciones</a>
                </p>
            </div>
        </div>
    )
}

export default Register