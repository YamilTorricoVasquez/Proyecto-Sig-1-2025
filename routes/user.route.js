import { Router } from "express"
import { UserController } from "../controllers/user.controller.js"

import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js"


const router = Router()

//api/v1
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/registrar_cliente', UserController.registrarClientes)





export default router;