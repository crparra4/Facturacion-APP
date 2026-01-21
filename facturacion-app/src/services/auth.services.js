const API_URL = "http://localhost:4000/auth"



//funcion de Login
export const loginRequest = async(usuario , password) =>{
    const response = await fetch(`${API_URL}/login`,{
        method: "POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({usuario , password})
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.error || "Error Iniciar Sesion")
    }

    return data
}

//funcion de Register
export const RegisterRequest = async(usuario , password , fecha_nacimiento , correo) =>{
    const response = await fetch(`${API_URL}/register`,{
        method: "POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({usuario , password ,fecha_nacimiento , correo})
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.error || "Error al registrarse")
    }

    return data
}