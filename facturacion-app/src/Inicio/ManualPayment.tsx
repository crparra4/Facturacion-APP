import { useState, useEffect } from "react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import './ManualPayment.css';
import iconotarjeta from "../assets/metodo-de-pago.png";
import busquedad from "../assets/busquedadL.png";
import { buscar_estudiante } from '../services/principal.services';
import Iconoperfil from "../assets/iconoPerfil.png"
import IconoGrado from "../assets/iconogrado.png"
import IconoCalendario from "../assets/iconoCalendario.png"
import {InvoiceTemplate} from "./InvoiceTemplate"
import {facturacion , actualizarfactura} from "../services/ManuelPaymentF"
import swal from "sweetalert2";

//interfaz del estudiante en general
interface Estudiante {
  nombres: string;
  apellidos: string;
  grado: string;
  curso: string;
  documento : number;
  monto: number;
  valor_con_interes : number;
  mes: string;
  fecha_vencimiento: string;
  segunda_fecha_vencimiento: string; 
}

//interfaz para los pagos
interface pagoDetalles {
  mes: string;
  tipo: string;
  valor: number;
}

const ManualPayment = () => {
  const [id, Set_id] = useState("");
  const [error, Set_error] = useState("");
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [mesSeleccionado , setMesSeleccionado] = useState("");
  const [Tipodepago , setTipodepago] = useState<string>("")
  const [listaPagos, setListaPagos] = useState<pagoDetalles[]>([]); // lista de actualizacion de la factura
  const [numeroFactura, setNumeroFactura] = useState("---");
  const componentRef = useRef<HTMLDivElement>(null);

  const mesesArray : string[] = estudiante?.mes ? estudiante.mes.split(",").map(m=> m.trim()):[];

  // --- NUEVOS ESTADOS ---
  const [isEditing, setIsEditing] = useState(false);
  
  // Estado para manejar los datos del formulario mientras se edita
  const [formData, setFormData] = useState({
    monto: 0,
    montoConInteres: 0,
    mes: "",
    fecha_vencimiento: "",
    segunda_fecha_vencimiento: ""
  });

  //alertar
  const Toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', swal.stopTimer)
      toast.addEventListener('mouseleave', swal.resumeTimer)
    }
  })

  // Cuando cargamos un estudiante, inicializamos el formData
  useEffect(() => {
    if (estudiante) {
      const montoNum = Number(estudiante.monto);
      const montoconIntereses = Number(estudiante.valor_con_interes)
      setFormData({
        monto: montoNum,
        montoConInteres: montoconIntereses, // Ejemplo de cálculo
        mes: estudiante.mes,
        fecha_vencimiento: new Date(estudiante.fecha_vencimiento).toLocaleDateString(),
        segunda_fecha_vencimiento : new Date(estudiante.segunda_fecha_vencimiento).toLocaleDateString(),
      });
    }
  }, [estudiante]);

  useEffect(()=> {
    if(mesSeleccionado !== ""){
      agregarPagoALista();
    }
  },[mesSeleccionado])

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMesSeleccionado("");
    setListaPagos([]);
    Set_error("");
    setIsEditing(false); // Reseteamos modo edición al buscar nuevo

    if (!id.trim()) {
      Set_error("Por favor, ingrese un ID para buscar.");
      return;
    }

    try {
      const datos = await buscar_estudiante(id);

      setEstudiante(datos);
      Set_error("");
    } catch (err) {
      setEstudiante(null);
      if (err instanceof Error) {
        Set_error(err.message);
      } else {
        Set_error("Error desconocido");
      }
    }
  };

  const handlePrint = useReactToPrint({
    contentRef :componentRef ,
    documentTitle: `Factura_${id}`,
  });


  // --- MANEJADORES DE EDICIÓN ---

  // Actualizar valores en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Botón "Editar"
  const handleEditClick = () => {
    setIsEditing(true);
  };


  // Botón "Cancelar": Salir de edición y revertir cambios
  const handleCancel = () => {
    if (estudiante) {
        // Revertimos al estado original guardado en 'estudiante'
        const montoNum = Number(estudiante.monto);
        const montoconIntereses = Number(estudiante.valor_con_interes)
        setFormData({
            monto: montoNum,
            montoConInteres: montoconIntereses,
            mes: estudiante.mes,
            fecha_vencimiento: new Date(estudiante.fecha_vencimiento).toLocaleDateString(),
            segunda_fecha_vencimiento:new Date(estudiante.segunda_fecha_vencimiento).toLocaleDateString(),
        });
    }
    setIsEditing(false);
  };

  // Botón "Restablecer": Mantener edición pero revertir datos
  const handleReset = () => {
    if (estudiante) {
        const montoNum = Number(estudiante.monto);
        setFormData({
            monto: montoNum,
            montoConInteres: montoNum + 5000,
            mes: estudiante.mes,
            fecha_vencimiento: new Date(estudiante.fecha_vencimiento).toLocaleDateString(),
            segunda_fecha_vencimiento: new Date(estudiante.segunda_fecha_vencimiento).toLocaleDateString(),
        });
    }
    // NOTA: No hacemos setIsEditing(false) aquí
  };

  // Botón "Guardar Cambios": Actualizar estado local y salir de edición
  const handleSave = () => {
    if (estudiante) {
        // Actualizamos el objeto estudiante principal para que refleje los cambios en la UI
        // (Nota: Esto no envía a la API todavía, solo actualiza la vista local final)
        setEstudiante({
            ...estudiante,
            monto: Number(formData.monto),
            valor_con_interes: Number(formData.montoConInteres),
            mes: formData.mes,
            fecha_vencimiento: formData.fecha_vencimiento,
            segunda_fecha_vencimiento: formData.segunda_fecha_vencimiento 
        });

        // Aquí podrías agregar la llamada a la API para actualizar en backend si es necesario
        try{
          const resnponde = actualizarfactura(id , Number(formData.monto) , Number (formData.montoConInteres) , formData.mes , formData.fecha_vencimiento , formData.segunda_fecha_vencimiento);
          Toast.fire({
            icon: 'success',
            title: 'Factura actualizada correctamente'
          })
        }catch(error){
          console.error("Error al actualizar la factura:", error); 
        }

    }
    setIsEditing(false);
  };

  //funcion de actualizacion de lista 
  const agregarPagoALista = () =>{
    //si se encuentra messeleccion y tipo de pago
    if(!mesSeleccionado || !Tipodepago){
      return;
    }

    //para no repetir los meses
    if(listaPagos.some(p=> p.mes === mesSeleccionado)){
      console.log("Este mes ya fue agregado")
      return;
    }
    //guarda el valor de cada mes
    const valorCalculado = Tipodepago === "Normal"
      ? Number(estudiante?.monto)
      :Number(estudiante?.valor_con_interes);

    //guardamos los datos anteriores 
    const nuevoPago: pagoDetalles ={
        mes: mesSeleccionado,
        tipo: Tipodepago,
        valor: valorCalculado
    };
    //guardamos en lista de pago
    setListaPagos([...listaPagos , nuevoPago]);
    //limpiamos las casillas anteriores 
    setMesSeleccionado("");
    setTipodepago("");
  }

  const eliminarPagoDeLista = (mes: string) => {
    // Filtramos la lista para quitar el mes seleccionado
    const nuevaLista = listaPagos.filter(pago => pago.mes !== mes);
    setListaPagos(nuevaLista);
};
  
  const procesarPago = async() => {
      const stringMeses =  listaPagos.map(p=> p.mes).join(',');
      const stringTipo = listaPagos.map(p=> p.valor).join(',')
      const totalMonto = listaPagos.reduce((acc , current) => acc + current.valor , 0);

      try{
        const responde  = await facturacion(id , totalMonto ,stringMeses , stringTipo );
        setNumeroFactura(responde.id_pago);
        alert("Pago procesado correctamente. ID de Factura: " + responde.id_pago);
        setTimeout(() => {
            handlePrint();
        }, 300);

        Toast.fire({
          icon: 'success',
          title: 'Pago procesado correctamente'
        })


      }catch(error){
        Toast.fire({
          icon: 'error',
          title: 'Error al procesar el pago'
        })
      }
  }


  return (
    <div className="main-container">
      {/* Header y Search Card se mantienen igual... */}
      <header className="header-section">
        <div className="header-icon-box">
          <img src={iconotarjeta} alt="icon-card" />
        </div>
        <div className="header-text">
          <h1>Pago Manual</h1>
          <p>Realiza ajustes personalizados a los pagos individuales</p>
        </div>
      </header>

      <div className="search-card">
        {/* ... (código de búsqueda igual al anterior) ... */}
        <div className="card-header">
          <div className="circle-icon-sm">
            <img src={busquedad} alt="icon-busquedad" className="busquedad_icono-1"/>
          </div>
          <h2>Buscar Estudiante</h2>
        </div>
        <div className="description-text">
          <p>Ingresa el código del estudiante para consultar su información de pago</p>
        </div>  
        <div className="input-row">
          <input 
            type="number" 
            className="styled-input search-input" 
            placeholder="EJ - 67001025" 
            value={id}
            onChange={(e) => Set_id(e.target.value)}
          />
          <button className="search-btn" onClick={handleBuscar}>
             Buscar
          </button>
        </div>
        {error && <p className="error-msg">{error}</p>}
      </div>

      {!estudiante ? (
        <div className="empty-state-area">
          <div className="circle-icon-lg">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <h3>No hay estudiante seleccionado</h3>
          <p>Ingresa un código de estudiante arriba para comenzar.</p>
        </div>
      ) : (
        <div className="results-container animate-fade-in">
          
          {/* Tarjeta Info Estudiante (Igual que antes) */}
          <div className="info-card">
            <div className="card-title-row">
              <div className="icon-brown">
                <i className="fa-solid fa-user">
                  <img src={Iconoperfil} alt="icon-busquedad" className="busquedad_icono-1"/>
                  </i>
                  </div>
              <h3>Información del Estudiante</h3>
            </div>
            <div className="info-grid">
              <div className="info-pill">
                <div className="pill-icon"><i className="fa-solid fa-user"></i>
                <img src={Iconoperfil} alt="icon-busquedad" className="busquedad_icono-1"/>
                </div>
                <div className="pill-content">
                  <span className="pill-label">Nombre:</span>
                  <span className="pill-value">{estudiante.nombres} {estudiante.apellidos}</span>
                </div>
              </div>
              <div className="info-pill">
                <div className="pill-icon"><i className="fa-solid fa-graduation-cap"></i>
                <img src={IconoGrado} alt="icon-busquedad" className="busquedad_icono-1"/>
                </div>
                <div className="pill-content">
                  <span className="pill-label">Grado:</span>
                  <span className="pill-value">{estudiante.grado}</span>
                </div>
              </div>
              <div className="info-pill">
                <div className="pill-icon"><i className="fa-solid fa-calendar"></i>
                 <img src={IconoCalendario} alt="icon-busquedad" className="busquedad_icono-1"/>
                </div>
                <div className="pill-content">
                  <span className="pill-label">Año Académico:</span>
                  <span className="pill-value">2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Tarjeta de Recibo de Pago (MODIFICADA) */}
          <div className="receipt-card">
            <div className="receipt-header">
              <div className="receipt-title">
                <div className="icon-brown"><i className="fa-solid fa-dollar-sign"></i></div>
                <h3>Recibo de pago</h3>
              </div>
              {/* Solo mostramos el botón Editar si NO estamos editando */}
              {!isEditing && (
                <button className="edit-btn" onClick={handleEditClick}>
                    <i className="fa-solid fa-pen"></i> Editar
                </button>
              )}
            </div>
            
            <p className="receipt-id">ID: PAY-2024-{id}</p>

            <div className="form-grid">
              <div className="form-group full-width">
                <label>Valor Sin Interés</label>
                <div className="input-currency-wrapper">
                    <span className="currency-symbol">$</span>
                    <input 
                    type="number" 
                    name="monto"
                    value={formData.monto} 
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={isEditing ? "editable-input" : "readonly-input"} 
                    />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Valor Con Interés</label>
                <div className="input-currency-wrapper">
                    <span className="currency-symbol">$</span>
                    <input 
                    type="number" 
                    name="montoConInteres"
                    value={formData.montoConInteres} 
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={isEditing ? "editable-input" : "readonly-input"} 
                    />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Meses de Pagos</label>
                <input 
                  type="text" 
                  name="mes"
                  value={formData.mes} 
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={isEditing ? "editable-input" : "readonly-input"} 
                />
              </div>

              <div className="form-group full-width">
                <label>Fecha Preferida de Pago (Año-Día)</label>
                <input 
                  type="text" 
                  name="fecha_vencimiento"
                  value={
                    formData.fecha_vencimiento 
                      ? (() => {
                          const f = String(formData.fecha_vencimiento);
                          
                          // Si viene de la DB (Ej: "2026-04-06")
                          if (f.includes('-')) {
                            const partes = f.split('-'); 
                            // partes[0] es 2026, partes[1] es 04, partes[2] es 06
                            return `${partes[0]}-${partes[2]}`; // Resultado: "2026-06"
                          }
                          
                          // Si viene con formato latino (Ej: "6/4/2026")
                          if (f.includes('/')) {
                            const partes = f.split('/');
                            const dia = partes[0].padStart(2, '0');
                            const anio = partes[2];
                            return `${anio}-${dia}`; // Resultado: "2026-06"
                          }
                          
                          return f;
                        })()
                      : ""
                  } 
                  onChange={handleChange}
                  placeholder="YYYY-DD"
                  readOnly={!isEditing}
                  className={isEditing ? "editable-input" : "readonly-input"} 
                />
              </div>

              <div className="form-group full-width">
                <label>Segunda Fecha Preferida</label>
                <input 
                  type="text" 
                  name="segunda_fecha"
                  value={
                    formData.segunda_fecha_vencimiento
                      ? (() => {
                          const f = String(formData.segunda_fecha_vencimiento);
                          
                          // Si viene de la DB (Ej: "2026-04-06")
                          if (f.includes('-')) {
                            const partes = f.split('-'); 
                            // partes[0] es 2026, partes[1] es 04, partes[2] es 06
                            return `${partes[0]}-${partes[2]}`; // Resultado: "2026-06"
                          }
                          // Si viene con formato latino (Ej: "6/4/2026")
                          if (f.includes('/')) {
                            const partes = f.split('/');
                            const dia = partes[0].padStart(2, '0');
                            const anio = partes[2];
                            return `${anio}-${dia}`; // Resultado: "2026-06"
                          }

                          return f;
                        })()
                      : ""
                  } 
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={isEditing ? "editable-input" : "readonly-input"} 
                />
              </div>
            </div>

            {/* ZONA DE BOTONES CONDICIONAL */}
            <div className="action-buttons-container">
                {isEditing ? (
                    /* Botones MODO EDICIÓN */
                    <div className="edit-mode-buttons">
                        <button className="btn-save" onClick={handleSave}>Guardar Cambios</button>
                        <button className="btn-reset" onClick={handleReset}>Restablecer</button>
                        <button className="btn-cancel" onClick={handleCancel}>Cancelar</button>
                    </div>
                ) : (
                    /* Botones MODO NORMAL (Pagar/Imprimir) */
                    <div className="normal-mode-buttons">
                        <button className="btn-outline">Imprimir</button>
                        <button className="btn-solid">Pagar</button>
                    </div>  
                )}
            </div>

          </div>
                <section className="form-section receipt-section-container">
        <div className="receipt-grid">
          <div className="receipt-card left-card">
            <div className="card-header-simple">
              <div className="icon-brown-circle">$</div>
              <h2>Recibo de pago</h2>
            </div>
            <hr className="divider-transparent" />
            <div className="inputs-row">
              <div className="receipt-input-group">
                <label>Mes a pagar</label>
                <select className="receipt-select" value={mesSeleccionado} onChange={(e)=> setMesSeleccionado(e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {/* Aquí tomamos los meses que elegiste arriba (formData.meses) */}
                  {mesesArray.length > 0 ? (
                    mesesArray.map((mes, index) => (
                    <option key={index} value={mes}>
                        {mes}
                    </option>
                    ))
                  ) : (
                    <option disabled>No hay meses disponibles</option>
                  )}
                </select>
              </div>
              <div className="receipt-input-group">
                <label>Pago</label>
                <select className="receipt-select" value={Tipodepago} onChange={(e)=> setTipodepago(e.target.value)}>
                  <option value={""}>Tipo</option>
                  <option value={"Normal"}>Normal</option>
                  <option value={"Mora"}>Mora</option>
                </select>
              </div>
            </div>

            {/* Etiquetas (Pills) de ejemplo estáticas */}
            {listaPagos.length > 0 ?(
              <div className="tags-area">
                {listaPagos.map((item , index) => (
                  <span key={index} className="brown-tag">{item.mes}</span>
                ))}
              </div>
            ) : (
              <p style={{textAlign: 'center' , color: '#aaaa'}}> No hay meses seleccionado</p>
            )}
            <div className="spacer-auto"></div>

            <button className=  "btn-print-outline" onClick={handlePrint}>
              Imprimir
            </button>
            {estudiante && (
              <div className="print-area-container" style={{ display: 'block' }}>
              
              {/* Asegúrate de que InvoiceTemplate tenga <tbody> adentro */}
              <InvoiceTemplate
              ref={componentRef}
              estudiante={estudiante}
              listaPagos={listaPagos}
              idEstudiante={id}
              idFactura={numeroFactura}
              />
              </div>
            )}  
          </div>

          {/* --- TARJETA DERECHA: DETALLES DEL RECIBO --- */}
          <div className="receipt-card right-card">
            <div className="details-header">
              <h2>Detalles del Recibo</h2>
              <span className="receipt-id">ID: PAY-2024-001</span>
            </div>

            {/* Perfil Estático */}
            <div className="profile-preview">
              <div className="avatar-preview">
                {/* Usamos una imagen random o un div de color si no hay imagen */}
                <img src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg" alt="Student" />
              </div>
              <div className="profile-info">
                <span className="info-label">Nombre Completo</span>
                <h3>{estudiante.nombres} {estudiante.apellidos}</h3>
                <div className="profile-meta">
                  <div className="meta-item">
                    <span className="info-label">Grado:</span>
                    <span className="meta-val">{estudiante.curso}</span>
                  </div>
                  <div className="meta-item">
                    <span className="code-val">EST-2024-001</span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="divider-soft" />
            {/* Lista de Pagos Estática */}
            <div className="payment-list">
                  {listaPagos.length > 0 ? (
                    listaPagos.map((item, index) => (
                      <div className="payment-row" key={index}>
                        <div className="payment-info-text">
                          <span>{item.mes}</span>
                          <small  className= "tag-tipo">
                            ({item.tipo})
                          </small>
                        </div>
                      <div className="payment-value-action"> 
                      <span className="price">${item.valor.toLocaleString()} COP</span>
                      {/*boton eliminar */}
                      <button className="btn-delete-item" onClick={()=>eliminarPagoDeLista(item.mes)} title="Eliminar mes">
                        X 
                      </button>
                      </div> 
                    </div>
                    ))
                  ) : (
                  <p style={{ textAlign: 'center', color: '#aaa' }}>No hay meses seleccionados</p>
                  )}
            </div>

            <div className="total-section">
                <span>Total</span>
                <span className="total-price">${listaPagos.reduce((acc , current) => acc + current.valor , 0).toLocaleString()} COP</span>
            </div>

            <button className="btn-save-brown" onClick={procesarPago}>
              Pagos
            </button>
          </div>
        </div>
      </section>
        </div>
      )}
      
    </div>
  );
};

export default ManualPayment;