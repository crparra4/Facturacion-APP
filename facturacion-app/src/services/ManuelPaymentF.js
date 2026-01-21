
const API_URL = "http://localhost:4000/facturas"

export const facturacion = async(id_estudiante , monto , meses  , tipo)=>{
    const hoy = new Date();
    const fecha_pago = `${hoy.getFullYear()}/${String(hoy.getMonth() + 1).padStart(2, '0')}/${String(hoy.getDate()).padStart(2, '0')}`

    const datosPago ={
        id_estudiante: id_estudiante,
        monto: monto,
        meses: meses,
        fecha_pago: fecha_pago,
        tipo: tipo
    }

    const response = await fetch(`${API_URL}/subirfactura`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datosPago)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al procesar el pago manual");
    }

    return data;
        
}

export const actualizarfactura = async(id , monto , valor_con_interes , mes ,fecha_vencimiento , segunda_fecha_vencimiento)=>{

    const formatearHaciaDB = (valorInput) => {
            if (!valorInput) return null;


            if (valorInput.includes('-')) {
                const partes = valorInput.split('-');
                
               
                if (partes.length === 2) {
                    const anio = partes[0];
                    const dia = partes[1].padStart(2, '0'); 
                    return `${anio}-01-${dia}`; 
                }
            }
            return valorInput; 
        };

    const response = await fetch(`${API_URL}/actualizar/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            monto: monto,
            valor_con_interes: valor_con_interes,
            mes: mes,
            fecha_vencimiento: formatearHaciaDB(fecha_vencimiento), 
            segunda_fecha_vencimiento: formatearHaciaDB(segunda_fecha_vencimiento)
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al actualizar la factura");
    }

    return data;
}