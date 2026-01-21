
//leer la base de datos
const pool = require("../db")

//bcrypt
const brcypt = require("bcrypt")

//jwt
const jwt = require("jsonwebtoken")


//funcion de login
const login = async(req , res) => {
    const {usuario ,  password} = req.body

    console.log("Entro" , usuario , password)

    //validacion de campos
    if(!usuario || !password){
        return res.status(404).json({
            error:"Usuario y Contraseña son obligatorios"
        })
    }

    try{

        //realiza la busqueda
        const result = await pool.query(
            "SELECT id , usuario , password FROM usuarios WHERE usuario = $1",
            [usuario]
        )
        //validar credenciales
        if(result.rows.length === 0){
            return res.status(401).json({
                error:"Credenciales incorrectas"
            })
        }
        const user = result.rows[0]
        const validarContraseña = await brcypt.compare(password , user.password)
        if(!validarContraseña){
            return res.status(401).json({
                error:"Contraseña Incorrecta"
            })
        }

        
        //Creacion de TOKEN
        const token = jwt.sign(
            {
                id:user.id,
                usuario:user.usuario
            },
            process.env.JWT_SECRET,
            {
                expiresIn:process.env.JWT_EXPIRES
            }
        )

        //Respuesta existosa
        res.json({
            message: "Login Exitoso",
            user:result.rows[0],
            token
        })

    }catch(error){
        console.error(error)
        res.status(500).json({
            error:"Error del servidor"
        })
    }
}

//Registro

const register  = async(req , res) =>{
    const{usuario , password , fecha_nacimiento,correo} = req.body

    //verificacion de campos vacios
    if(!usuario || !password || !fecha_nacimiento || !correo){
        return res.status(404).json({
            error:"Rellenar Todos los campos"
        })
    }
    
    try{
        //verificar que usuarios exista
        const user_exit = await pool.query(
            "SELECT usuario From usuarios WHERE usuario = $1",
            [usuario]
        )

        if(user_exit.rows.length > 0){
            return resizeTo.status(401).json({
                error:"Este usuario ya existe"
            })
        }

        //Procesos de encryptar Contraseña
        const salRounds = 10
        const hanshedPassword = await brcypt.hash(password , salRounds)

        //enviar datos de registro
        const result = await pool.query(
            "INSERT INTO usuarios (usuario, password , fecha_nacimiento , correo) VALUES ($1,$2,$3,$4) RETURNING id, usuario",
            [usuario , hanshedPassword , fecha_nacimiento , correo]
        )
        res.status(201).json({
            message:"Usuarios registrado correctamente",
            user: result.rows[0],
        })

    }catch(error){
        console.error(error)
        res.status(500).json({
            error:"Error Servidor"
        })
    }
}

module.exports = {login , register}