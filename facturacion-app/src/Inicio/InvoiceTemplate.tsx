import React, { forwardRef } from 'react';
import logocv from "../assets/Logo.webp"; 

interface InvoiceProps {
  estudiante: any;
  listaPagos: any[];
  idEstudiante: string;
  idFactura : string | null;
}

export const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceProps>(({ estudiante, listaPagos, idEstudiante , idFactura }, ref) => {
  
  const fechaColombia = new Date().toLocaleDateString('es-CO', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }); 

  const totalGeneral = listaPagos.reduce((acc, curr) => acc + curr.valor, 0);


    const containerStyle: React.CSSProperties = {
      width: '8.5in',
      minHeight: '5.5in',
      height: 'auto',       
      padding: '0.35in 0.35in 0.5in 0.35in',
      boxSizing: 'border-box',
      backgroundColor: '#fff',
      color: '#000',
      fontFamily: 'Arial, sans-serif',
      overflow: 'visible',
      pageBreakInside: 'avoid'
    };
  const tableStyle = { width: '100%', borderCollapse: 'collapse' as const, fontSize: '12px', marginBottom: '10px' };
  const thStyle = { border: '1px solid #000', padding: '6px', backgroundColor: '#d9d9d9', fontWeight: 'bold', textAlign: 'left' as const };
  const tdStyle = { border: '1px solid #000', padding: '6px', textAlign: 'left' as const };
  const centerStyle = { ...tdStyle, textAlign: 'center' as const };

  return (
    <div ref={ref} className="print-area-container" style={containerStyle}>
      
      {/* --- ENCABEZADO --- */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '15px' }}>
        
        <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          
          {/* Logo */}
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
             <img src={logocv} alt="Logo" style={{ width: '90px', height: 'auto' }} />
          </div>

          <div style={{ textAlign: 'center', width: '100%' }}>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: 'bold', color: '#3e2723' }}>COLEGIO LOPE DE VEGA</h2>
            <p style={{ fontSize: '11px', margin: '2px 0' }}>PREESCOLAR, EDUCACIÓN BÁSICA PRIMARIA Y SECUNDARIA</p>
            <p style={{ fontSize: '10px', margin: '1px 0' }}>Resolución No. 666 MARZO 3 DE 2003 INSCRIPCIÓN ANTE SED No. 3406-DANE 311001037566</p>
            <p style={{ fontSize: '10px', margin: '1px 0' }}>NIT: 311001037566</p>
            <p style={{ fontSize: '10px', margin: '1px 0' }}>DIR.: Calle 4F No. 39D - 30, Barrio Primavera, Tels 2375098 - 2772485, Bogotá D.C.</p>
            <p style={{ fontSize: '10px', margin: '1px 0' }}>www.colegiolopedevega.edu.co</p>
            <p style={{ fontSize: '9px', margin: '5px 0 0 0', fontStyle: 'italic' }}>
              Autorización de Facturación No. 18762002892231 Del 11 de Abril de 2017 Desde: PEN 1 Hasta PEN 12.000
            </p>
          </div>
        </div>

        {/* Línea divisoria gruesa */}
        <div style={{ width: '100%', height: '3px', backgroundColor: '#3e2723', marginTop: '15px', marginBottom: '10px' }}></div>
        
        <h3 style={{ margin: 0, fontSize: '16px', letterSpacing: '1px', fontWeight: 'bold' }}>RECIBO</h3>
      </div>

      {/* --- TABLA 1: FECHA Y FACTURA --- */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{...thStyle, width: '30%'}}>FECHA</th>
            <th style={{...thStyle, width: '40%', textAlign: 'center'}}>N° FACTURA</th>
            <th style={{...thStyle, width: '30%', textAlign: 'center'}}>COD. ESTUD.</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={centerStyle}>{fechaColombia}</td>
            <td style={{...centerStyle, fontWeight: 'bold', fontSize: '14px'}}>{idFactura}</td>
            <td style={centerStyle}>{idEstudiante}</td>
          </tr>
        </tbody>
      </table>

      {/* --- TABLA 2: DATOS DEL ESTUDIANTE --- */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{...thStyle, width: '40%'}}>NOMBRE ESTUDIANTE</th>
            <th style={{...thStyle, width: '20%'}}>IDENTIFICACION</th>
            <th style={{...thStyle, width: '10%'}}>CURSO</th>
            <th style={{...thStyle, width: '30%'}}>DIRECCIÓN</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{...tdStyle, textTransform: 'uppercase', fontWeight: 'bold'}}>
              {estudiante.apellidos} {estudiante.nombres}
            </td>
            <td style={centerStyle}>{estudiante.documento || 'N/A'}</td>
            <td style={centerStyle}>{estudiante.curso}</td>
            <td style={tdStyle}>{estudiante.grado || 'CLL 4F 39D 03'}</td>
          </tr>
        </tbody>
      </table>

      {/* --- TABLA 3: DETALLES DE PAGO --- */}
      <table style={{ ...tableStyle, marginTop: '15px' }}>
        <thead>
          <tr>
            <th style={{...thStyle, width: '25%'}}>MES A PAGAR</th>
            <th style={{...thStyle, width: '50%'}}>CONCEPTO / DETALLE</th>
            <th style={{...thStyle, width: '25%', textAlign: 'right'}}>VALOR</th>
          </tr>
        </thead>
        <tbody>
          {listaPagos.map((pago, index) => (
            <tr key={index}>
              <td style={{...tdStyle, textTransform: 'uppercase'}}>{pago.mes}</td>
              <td style={tdStyle}>PENSION 2025 ({pago.tipo})</td>
              <td style={{...tdStyle, textAlign: 'right'}}>$ {pago.valor.toLocaleString()}</td>
            </tr>
          ))}
          
          {/* Filas vacías de relleno visual */}
          {listaPagos.length < 3 && Array.from({ length: 3 - listaPagos.length }).map((_, i) => (
             <tr key={`empty-${i}`}>
               <td style={{...tdStyle, height: '25px'}}></td>
               <td style={tdStyle}></td>
               <td style={tdStyle}></td>
             </tr>
          ))}
        </tbody>
        <tfoot>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
                <td colSpan={2} style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', fontWeight: 'bold', fontSize: '14px' }}>TOTAL A PAGAR</td>
                <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', fontWeight: 'bold', fontSize: '14px' }}>
                    $ {totalGeneral.toLocaleString()}
                </td>
            </tr>
        </tfoot>
      </table>

      {/* Firma */}
      <div style={{ marginTop: '50px', display: 'flex' }}>
         <div style={{ textAlign: 'center', borderTop: '1px solid #000', width: '250px', paddingTop: '5px', marginLeft: '20px' }}>
            <p style={{ fontSize: '11px', margin: 0, fontWeight: 'bold' }}>Firma y Sello Cajero</p>
         </div>
      </div>

    </div>
  );
});