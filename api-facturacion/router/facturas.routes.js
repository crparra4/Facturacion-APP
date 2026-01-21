const express = require("express")
const router = express.Router()
const {crearFactura , actualizarFactura , buscar_estudiante , subir_factura , obtenerReportesFiltrados} = require("../controllers/facturas.controller")
const verificacionToken = require("../middlewares/auth.middleware")


router.post("/por-grado" , crearFactura ,verificacionToken)
router.put("/actualizar/:id" , actualizarFactura ,verificacionToken)
router.get("/leer/:id", buscar_estudiante , verificacionToken)
router.post("/subirfactura" , subir_factura , verificacionToken)
router.get("/reportesfactura" , obtenerReportesFiltrados , verificacionToken)

module.exports = router