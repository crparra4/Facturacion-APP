const express = require("express")
const router = express.Router()
const {login , register } = require("../controllers/auth.controller")

router.post("/login" , login) // endpoints de login
router.post("/register" , register )//endpoints de register
module.exports = router


