import React, { useState } from 'react'
import iconotarjeta from "../assets/metodo-de-pago.png"
import "../Inicio/AsignacionPagos.css"
import {generar_Years} from "../services/fechaAutomatica"
import {create_facturacion} from "../services/principal.services"
import Swal from 'sweetalert2';


const AsignacionPagos  = () => {

    //notificacion
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end', // Esquina superior derecha
        showConfirmButton: false, // No necesita botón de "OK"
        timer: 3000, // Se cierra en 3 segundos
        timerProgressBar: true, // Muestra una barrita de tiempo abajo
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });


    const listaAnios = generar_Years(0,4)
    //definicion de variables
    interface FormData {
        grado: string
        anio: string
        valorSinInteres: string
        valorConInteres: string
        meses: string[]
        fechaPreferida1: string
        fechaPreferida2: string
    }
    //definimos un formadata
    const [formData, setFormData] = useState<FormData>({
        grado: "",
        anio: "",
        valorSinInteres: "",
        valorConInteres: "",
        meses: [],
        fechaPreferida1: "",
        fechaPreferida2: ""
    })

    //definimos para llenar ese formdata
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
        ) => {
        const { name, value } = e.target

        setFormData(prev => ({
            ...prev,
            [name as keyof FormData]: value
        }))
    }

    //creamos una para leer los meses ( selecionarlos y quitar)
    const toggleMonth = (month: string) => {
        setFormData(prev => ({
            ...prev,
            meses: prev.meses.includes(month)
                ? prev.meses.filter(m => m !== month)
                : [...prev.meses, month]
        }))
    }
    //funcion para boton de cancelar         
    const handleCancel = () => {
        Swal.fire({
            title: '¿Limpiar formulario?',
            text: "Se borrarán todos los datos ingresados",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, limpiar',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                setFormData({
                    grado: "",
                    anio: "",
                    valorSinInteres: "",
                    valorConInteres: "",
                    meses: [],
                    fechaPreferida1: "",
                    fechaPreferida2: ""
                }); 
                Toast.fire({
                    icon: 'info',
                    title: 'Formulario vaciado'
                });
            }
        });
        }

    //funcion del boton guardar
    const handlesave = async(e: React.FormEvent) =>{
        e.preventDefault()
        if (!formData.grado || !formData.anio || !formData.valorConInteres || !formData.valorConInteres) {
            Toast.fire({
            icon: 'warning',
            title: 'Faltan datos obligatorios'
            });
            return;          
        }

        try{
            const data = await create_facturacion(formData)
            //ventanda en verde
            // 2. TOAST VERDE (Éxito)
            Toast.fire({
                icon: 'success',
                title: '¡Guardado correctamente!'
            });
        }catch(error: any){
            Toast.fire({
                icon: 'error',
                title: error.message || 'Error al conectar con el servidor'
            })
        }
    }


    return(
        <div className = "main-container">
            {/*Encabezado Principal */}
            <header className='page-header'>
                <div className="header-icon">
                    <img src ={iconotarjeta} alt= "icon-card"/> 
                </div>
            <div>
                <h1>Asignación de Pagos</h1>
                <p>Configura los valores y fechas de pago por grado</p>
            </div>
            </header>

            <div className="content-card">
                {/* Sección 1: Información de Grado */}
                <section className="form-section">
                    <h2 className="section-title">
                        <span className="icon-circle">🎓</span> Información de Grado
                    </h2>
                    <hr />
                    <div className="grid-2-col">
                        <div className="input-group">
                            <label>Grado Académico</label>
                            <select name='grado' value={formData.grado} onChange={handleChange}>
                                <option value="" >Selecciona el grado</option>
                                {Array.from({length:11} , (_, i) => i + 1).map((grado)=>(
                                    <option key={grado} value={grado}>
                                        Grado {grado}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Año Académico</label>
                            <select  name="anio"  value={formData.anio}  onChange={handleChange}>
                                <option value="" disabled>Selecciona el año</option>
                                {listaAnios.map(anio =>(
                                    <option key={anio} value={anio}>{anio}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Sección 2: Valores de Grado */}
                <section className="form-section">
                    <h2 className="section-title">
                        <span className="icon-circle">💲</span> Valores de Grado
                    </h2>
                    <hr />
                    <div className="grid-2-col">
                        <div className="value-card blue-tint">
                            <div className="value-card green-card">
                                <span className="badge green">Pago Oportuno</span>
                                <h3 className='card-label'>Valor sin Interés</h3>
                                <div className="input-with-icon">
                                    <span className="currency-symbol">$</span>
                                    <input type="number" name= "valorSinInteres" placeholder="0.00"  className= "price-input" value={formData.valorSinInteres} onChange={handleChange}/>
                                </div>
                                <p className="hint-text">Monto para pagos realizados antes de la fecha límite</p>
                            </div>
                        </div>
                        <div className="value-card red-tint">
                            <div className="value-card red-card">
                                <span className="badge red">Con mora</span>
                                <h3 className="card-label">Valor con Interés</h3>
                                <div className="input-with-icon">
                                    <span className="currency-symbol">$</span>
                                    <input type="number" name='valorConInteres' placeholder="0.00"  className="price-input" value={formData.valorConInteres} onChange={handleChange}/>
                                </div>
                                <p className="hint-text">Monto con recargo por pago tardío</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sección 3: Meses de Pago */}
                <section className="form-section">
                    <h2 className="section-title">
                        <span className="icon-circle">📅</span> Meses de pago
                    </h2>
                    <hr />
                    <div className="months-grid">
                        {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map(month => (
                        <button
                            key={month}
                            type="button"
                            className={`month-btn ${formData.meses.includes(month) ? "active" : ""}`}
                            onClick={() => toggleMonth(month)}
                        >
                         {month}
                         </button>
                    ))}
                    </div>
                </section>

                {/* Sección 4: Fechas Preferidas */}
                <section className="form-section">
                    <h2 className="section-title">
                        <span className="icon-circle">📅</span> Fechas de Preferida de Pagos
                    </h2>
                    <hr />
                    <div className="grid-2-col">
                        <div className="date-card blue-border blue-tint">
                            <h4>Primera fecha preferida</h4>
                            <input type="date" name='fechaPreferida1' className="date-input"  value={formData.fechaPreferida1} onChange={handleChange}/>
                            <p className="hint">Fecha límite sin aplicar intereses</p>
                        </div>
                        <div className="date-card red-border red-tint">
                            <h4>Segunda fecha preferida</h4>
                            <input type="date" name="fechaPreferida2" className="date-input"  value={formData.fechaPreferida2} onChange={handleChange}/>
                            <p className="hint">Segunda oportunidad antes de aplicar mora</p>
                        </div>
                    </div>
                </section>

                {/* Botones de Acción */}
                <div className="actions-footer">
                    <button className="btn-cancel" onClick={handleCancel} >Cancelar</button>
                    <button className="btn-save" onClick={handlesave}>Guardar Asignar</button>
                </div>
            </div>
        </div>
    );
}

export default AsignacionPagos;