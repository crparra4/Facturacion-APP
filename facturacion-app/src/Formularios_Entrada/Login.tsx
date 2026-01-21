import { useState } from "react";
import "../Formularios_Entrada/Login.css" /* importancia de Css */
import logocv from "../assets/Logo.webp" /* logo del colegio */ 
import iconGogle from "../assets/search.png" /* icono de google */
import {loginRequest} from "../services/auth.services"
import { useNavigate } from "react-router-dom"

function Login(){
    const navigate = useNavigate()

    const[usuario , setUsuario] = useState("")
    const[password , setPassword] = useState("")
    const[error , setError] = useState("")

    const handleLogin = async(e: React.FormEvent)=> {
        e.preventDefault()
        console.log(usuario , password)
        setError("")

        try{
            const data = await loginRequest(usuario , password)
            
            //GUARDA TOKEN  
            localStorage.setItem("Token",data.Token)
            console.log("Login exitoso", data)
            navigate("/Layout");
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
                <h2>Iniciar Sesión</h2>
                <p className="subtitle">Bienvenido al Portal</p>

                <form onSubmit={handleLogin}>
                    {error && <p style={{color : "RED"}}>{error}</p>}

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
                    {/* Password Input Field */}
                    <label>Contraseña:</label>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Ingresa tu Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {/* Olvidaste tu contraseña */}

                    <p  className= "forgot-password" onClick={()=>navigate("/register")}>
                       ¿No tienes cuenta?
                    </p>    
                    <button type="submit">Iniciar Sesión</button>
                </form>

                <div className="divider"></div>

                <div className="google-login">
                    <img src={iconGogle} alt="Google Icon" />
                </div>

                <p className="terms">
                    Al iniciar sesión, aceptas nuestros <a href="#">Términos y Condiciones</a>
                </p>
            </div>

        </div>
    )
}

export default Login



