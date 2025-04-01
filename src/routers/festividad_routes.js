import { Router } from "express"

import {
    crearFestividad,
    obtenerFestividades,
    listarFestividadesPorMes,
    actualizarFestividad,
    eliminarFestividad
} from "../controllers/festividad_controller.js"

import { verificarAutenticacion } from "../middlewares/autenticacion.js"
import { verificarAdminGeneral } from "../middlewares/autenticacion.js"

const router = Router()

router.post("/crear", verificarAutenticacion, verificarAdminGeneral, crearFestividad)
router.get("/festividades", obtenerFestividades)
router.get("/festividades-por-mes/:mes", listarFestividadesPorMes);
router.put("/actualizar/:id", verificarAutenticacion, verificarAdminGeneral, actualizarFestividad)
router.delete("/eliminar/:id", verificarAutenticacion, verificarAdminGeneral, eliminarFestividad)

export default router