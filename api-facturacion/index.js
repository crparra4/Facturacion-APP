const express = require("express")
const cors = require("cors")
require("dotenv").config()

const authRoutes = require("./router/auth.routes")
const facturaRoutes = require("./router/facturas.routes")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/facturas" , facturaRoutes)

app.get("/", (req, res) => {
  res.send("API Facturación funcionando ✅")
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
