import { Router } from "express"

import {
    crearFestividad,
    obtenerFestividades,
    listarFestividadesPorMes,
    actualizarFestividad,
    eliminarFestividad
} from "../controllers/festividad_controller.js"

import { verificarAutenticacion, permitirRoles } from "../middlewares/autenticacion.js"

const router = Router()

router.post("/crear", verificarAutenticacion, permitirRoles(["admin", "moderador"]), crearFestividad);
router.get("/festividades", obtenerFestividades)
router.get("/festividades-por-mes/:mes", listarFestividadesPorMes);
router.put("/actualizar/:id", verificarAutenticacion, permitirRoles(["admin", "moderador"]), actualizarFestividad);
router.delete("/eliminar/:id", verificarAutenticacion, permitirRoles(["admin", "moderador"]), eliminarFestividad);

export default router