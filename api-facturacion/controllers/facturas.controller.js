//Leer base de datos
const pool = require("../db")

//crear una factura
const crearFactura = async (req , res) => {
    const grado = req.body.grado
    const concepto = req.body.concepto || req.body.anio
    const monto = req.body.monto || req.body.valorSinInteres
    const valor_con_interes = req.body.valor_con_interes || req.body.valorConInteres
    const fecha_vencimiento = req.body.fecha_vencimiento || req.body.fechaPreferida1
    const segunda_fecha_vencimiento = req.body.segunda_fecha_vencimiento || req.body.fechaPreferida2
    const mes = Array.isArray(req.body.meses)
        ? req.body.meses.join(", ")
        : req.body.mes

    const estado = "pendiente"

    console.log("entre")

    //campos obligatorios
    if(!grado || !concepto || !monto){
        return res.status(404).json({
            error : "campos obligatorios faltantes"
        })
    }

    try{
        
        //crear factura para todos los estudiantes del grado
        const result = await pool.query(
            `
            INSERT INTO facturas (
                estudiante_id,
                grado,
                concepto,
                mes,
                monto,
                fecha_vencimiento,
                estado ,
                valor_con_interes ,
                segunda_fecha_vencimiento
            )
            SELECT
                codigo,
                grado,
                $1,
                $2,
                $3,
                $4,
                $6,
                $7,
                $8
            FROM estudiantes
            WHERE grado = $5
            RETURNING *
            `,
            [concepto , mes , monto ,fecha_vencimiento, grado ,estado , valor_con_interes ,segunda_fecha_vencimiento]
        )

        if(result.rowCount === 0){
            return res.status(404).json({
                error:"No hay estudiante en ese grado"
            })
        }

        res.status(201).json({
            message : "Factura creadas correctamente",
            total : result.rowCount,
            facturas: result.rows
        })

    }catch(error){
        console.error(error)

        //error de duplicacion en el numero de factura
        if(error.code == "23505"){
            return res.status(409).json({
                error:"Numero de factura existeste"
            })
        }

        res.status(505).json({
            error:"Error en el servidor"
        })
    }
}


//actualizar factura
const actualizarFactura = async(req , res) =>{
    const {id} = req.params;
    const {monto , valor_con_interes, mes , fecha_vencimiento , segunda_fecha_vencimiento} = req.body;
    
    if (!monto || !mes || !fecha_vencimiento) {
        return res.status(400).json({
        error: "Monto, mes y fecha de vencimiento son obligatorios"
        })
    }


    try{
        const result =  await pool.query(
            'UPDATE facturas SET monto = $1 , valor_con_interes = $2, mes = $3 , fecha_vencimiento = $4 ,  segunda_fecha_vencimiento = $5 WHERE estudiante_id = $6 RETURNING *',
            [monto , valor_con_interes, mes , fecha_vencimiento , segunda_fecha_vencimiento, id]  
        )

        if(result.rowCount === 0){
            return res.status(404).json({error : "factura no encontrada"})
        }

        res.json({
            message: "Factura actualiza correctamente" ,
            facturas: result.rows[0]
        })

    }catch(error){
        console.error(error);
        res.status(500).json({
            error : "Error en el servidor"
        })
    }
}


//traer datos
const buscar_estudiante = async(req , res) => {
    const {id} = req.params

    try{
        const result = await pool.query(
            `
            SELECT 
                e.nombres,
                e.apellidos,
                e.grado,
                e.curso,
                e.documento,
                f.monto,
                f.valor_con_interes,
                f.mes,
                f.fecha_vencimiento,
                f.segunda_fecha_vencimiento
            FROM estudiantes e
            JOIN facturas f ON f.estudiante_id = e.codigo
            WHERE e.codigo = $1
            ORDER BY f.fecha_vencimiento DESC
            LIMIT 1
            `,
            [id]
        )

        if(result.rowCount === 0){
            return res.status(404).json({
                error : "Estudiante o factura no encontrada"
            })
        }

        res.json(result.rows[0])
        
    }catch(error){
        console.error(error);
        res.status(500).json({
            error: "Error en el servidor"
        })
    }
}


const subir_factura = async(req , res) =>{
    const {id_estudiante , monto , meses , fecha_pago , tipo} = req.body;

    const client = await pool.connect();

    try{
        await client.query('BEGIN');

        //primero insertamos los reguistros en la tabla pagos 
        const queryPago = `INSERT INTO pagos (id_estudiante, monto, meses, fecha_pago, tipo) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
        const responsePago =await client.query(queryPago , [id_estudiante , monto , meses , fecha_pago , tipo]);

        //obtenemos los meses actuales de la tabla facturas
        const factura = await client.query('SELECT mes FROM facturas WHERE estudiante_id = $1', [id_estudiante]);
        if (factura.rowCount > 0) {
            const mesesBD = factura.rows[0].mes || "";
            
            // 1. Convertimos todo a minúsculas y quitamos espacios para comparar bien
            let arrayMesesBD = mesesBD.split(',').map(m => m.trim().toLowerCase());
            let arrayMesesPagados = meses.split(',').map(m => m.trim().toLowerCase());

            // LOG DE PRUEBA: Mira tu terminal para ver qué está comparando el servidor
            console.log("Meses en BD (limpios):", arrayMesesBD);
            console.log("Meses que quieres pagar:", arrayMesesPagados);

            // 2. Filtramos: Solo dejamos los meses que NO están en el pago
            // Usamos .filter y .includes de forma estricta
            const resultadoFiltrado = arrayMesesBD.filter(mes => !arrayMesesPagados.includes(mes));

            // 3. Formateamos para volver a guardar (Primera letra Mayúscula)
            const nuevoMeseString = resultadoFiltrado.length > 0
                ? resultadoFiltrado.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(', ')
                : '';

            // Actualizamos mesesRestantes para la respuesta JSON final
            mesesRestantes = resultadoFiltrado.map(m => m.charAt(0).toUpperCase() + m.slice(1));

            // 4. ACTUALIZAR TABLA FACTURAS
            await client.query('UPDATE facturas SET mes = $1 WHERE estudiante_id = $2', [nuevoMeseString, id_estudiante]);
            
            console.log("Resultado final que se guardará:", nuevoMeseString);
        }

        await client.query('COMMIT');

        //responder del server
        res.status(201).json({
            mensaje: "Pago procesado y factura actualizado correctamente" ,
            id_pago: responsePago.rows[0].id,
            meses_pendiente: mesesRestantes
        });

    }catch (error){
        await client.query('ROLLBACK')
        console.error("Error en la transacion: " , error)
        res.status(500).json({
            error: "Error al procesar el pago, no se realizaron cambios."
        })
    }finally{
        //libera la conexion
        client.release();
    }
}

const obtenerReportesFiltrados = async (req, res) => {
    const Reportes = await pool.connect(); //--> conxecion a la base de datos
    try{
        const { codigo, grado, anio, mes } = req.query;

        let query = 'SELECT e.nombres as estudiante  , e.codigo  as codigo , e.grado as grado , e.curso as curso , p.meses as meses_pagados , p.monto as monto_pagado , p.fecha_pago as periodo , p.tipo as pago , p.id as numerofacutra FROM pagos p INNER JOIN  estudiantes e ON p.id_estudiante = e.codigo WHERE 1 = 1';
        const  params = [];

        if(codigo){
            query += ' AND e.codigo = $' + (params.length + 1);
            params.push(codigo);
        }

        if(grado){
            query += ' AND e.grado = $' + (params.length + 1);
            params.push(grado);
        }

        if(anio){
            query += ' AND EXTRACT(YEAR FROM p.fecha_pago) = $' + (params.length + 1);
            params.push(anio);
        }

        if(mes){
            query += ' AND EXTRACT(MONTH FROM p.fecha_pago) = $' + (params.length + 1);
            params.push(parseInt(mes))
        }

        query += ' ORDER BY p.fecha_pago DESC';

        const result = await Reportes.query(query, params);

        res.json(result.rows);

    }catch(error){
        console.error(error);
        res.status(500).json({
            error: "Error en el servidor"
        })
    }finally{
        Reportes.release();
    }

}

module.exports = {crearFactura , actualizarFactura , buscar_estudiante , subir_factura , obtenerReportesFiltrados}