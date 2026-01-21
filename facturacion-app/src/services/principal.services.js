const API_URL = "http://localhost:4000/facturas"

//funcion que manda la peticion y los datos "/asignacionpagos" para crear la factura
export const create_facturacion = async (formData) =>{
    const response = await fetch(`${API_URL}/por-grado`, {
        method: "POST" ,
         headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(formData)
    })
    
    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error || "Error al guardar")
    }
    
    return data
}

//funcion para buscar el estudiante atravez de la ID manda la peticion
export const buscar_estudiante = async (id) =>{
    const response = await fetch ( `${API_URL}/leer/${id}` , {
        method: "GET",
        headers:{
            "Content-Type" : "application/json"
        },
    })

    const data = await response.json()

    if(!response.ok){
         throw new Error(data.error || "Error al encontrar al estudiante")
    }

    return data
}

